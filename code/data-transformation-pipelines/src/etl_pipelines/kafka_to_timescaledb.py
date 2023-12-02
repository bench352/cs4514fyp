import json
import uuid
from typing import AsyncIterable

import pendulum
from aiokafka import AIOKafkaConsumer
from loguru import logger
from psycopg.errors import UniqueViolation, DatabaseError
from psycopg_pool import AsyncConnectionPool
from pydantic import ValidationError

from env import KafkaToTimescaleDBSettings
from etl_pipelines.base import BaseETLPipeline
from schemas import kafka, timescaledb


class KafkaToTimescaleDBPipeline(BaseETLPipeline[str, str]):
    _pool: AsyncConnectionPool | None = None

    def __init__(self):
        self._config = KafkaToTimescaleDBSettings()

    async def extract(self) -> AsyncIterable[str]:
        kafka_consumer = AIOKafkaConsumer(
            self._config.kafka_topic,
            bootstrap_servers=f"{self._config.kafka_host}:{self._config.kafka_port}",
            group_id=self._config.consumer_group,
        )
        await kafka_consumer.start()
        logger.info("Connected to Kafka Broker [{}]", self._config.kafka_host)
        try:
            async for message in kafka_consumer:
                yield message.value.decode("utf-8")
        finally:
            await kafka_consumer.stop()

    async def transform(self, extracted: str) -> timescaledb.EntriesForDatabase | None:
        try:
            raw_payload_dict = json.loads(extracted)
            kafka_payload = kafka.KafkaMessageForTelemetry(
                timestamp=pendulum.parse(raw_payload_dict["timestamp"]),
                device_id=uuid.UUID(raw_payload_dict["device_id"]),
                key=raw_payload_dict["key"],
                value=raw_payload_dict["value"],
            )
            return timescaledb.EntriesForDatabase(
                timestamp=kafka_payload.timestamp,
                device_id=kafka_payload.device_id,
                key=kafka_payload.key,
                value=kafka_payload.value,
            )
        except json.JSONDecodeError:
            logger.error("Received message is not a valid JSON: {}", extracted)
        except KeyError as e:
            logger.error("Received message is missing key: {}", e)
        except ValidationError as e:
            logger.error(
                "Received message is not a valid KafkaMessageForTelemetry: {}", e
            )
        return None

    async def load(self, transformed: timescaledb.EntriesForDatabase) -> None:
        if not self._pool:
            raise RuntimeError("Connection Pool is not initialized")
        async with self._pool.connection() as conn:
            async with conn.cursor() as cur:
                try:
                    await cur.execute(
                        f"""
                        INSERT INTO telemetry (device_id, timestamp, key, value)
                        VALUES ('{transformed.device_id}', '{transformed.timestamp}',
                        '{transformed.key}', {transformed.value})
                        """
                    )
                    await conn.commit()
                except UniqueViolation:
                    await conn.rollback()
                    logger.warning("Duplicated entry, it will not be stored: {}", transformed)
                except DatabaseError as e:
                    logger.error("The database failed: {}", e)

    async def run(self) -> None:
        self._pool = AsyncConnectionPool(
            conninfo=(
                f"postgresql://{self._config.timescaledb_user}:{self._config.timescaledb_password}@"
                f"{self._config.timescaledb_host}:{self._config.timescaledb_port}/{self._config.timescaledb_dbname}"
            )
        )
        logger.info("Connected to TimescaleDB [{}]", self._config.timescaledb_host)
        async for extracted in self.extract():
            transformed = await self.transform(extracted)
            if transformed:
                await self.load(transformed)
