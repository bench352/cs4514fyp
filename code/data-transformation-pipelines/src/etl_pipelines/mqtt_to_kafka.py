import json
import uuid
from typing import AsyncIterable

import aiomqtt
import pendulum
from aiokafka import AIOKafkaProducer
from loguru import logger
from pydantic import ValidationError

from env import MQTTToKafkaSettings
from etl_pipelines.base import BaseETLPipeline
from schemas import kafka


class MQTTToKafkaPipeline(BaseETLPipeline[str, kafka.KafkaMessageForTelemetry]):
    _kafka_producer: AIOKafkaProducer | None = None

    def __init__(self):
        self._config = MQTTToKafkaSettings()

    async def extract(self) -> AsyncIterable[str]:
        async with aiomqtt.Client(
            hostname=self._config.mqtt_host,
            port=self._config.mqtt_port,
            username=self._config.mqtt_username,
            password=self._config.mqtt_password,
        ) as client:
            async with client.messages() as messages:
                await client.subscribe(self._config.mqtt_topic_filter)
                logger.info(
                    "Subscribed to [{}] on MQTT Broker [{}]",
                    self._config.mqtt_topic_filter,
                    self._config.mqtt_host,
                )
                async for message in messages:
                    yield message.payload.decode("utf-8")

    async def transform(self, extracted: str) -> kafka.KafkaMessageForTelemetry | None:
        """
        Example MQTT payload:
        {
          "time": "2023-12-01T00:00:00.000Z",
          "deviceId": "d774792f-379f-47d6-81f3-b95aa3cb6ed9",
          "data": {
            "temperature": 25
          }
        }
        """
        try:
            mqtt_payload = json.loads(extracted)
            return kafka.KafkaMessageForTelemetry(
                timestamp=pendulum.parse(mqtt_payload["time"]),
                device_id=uuid.UUID(mqtt_payload["deviceId"]),
                key=list(mqtt_payload["data"].keys())[0],
                value=list(mqtt_payload["data"].values())[0],
            )
        except json.JSONDecodeError:
            logger.error("Received message is not a valid JSON: {}", extracted)
        except ValidationError as e:
            logger.error("Invalid payload: {}", e)
        except ValueError as e:
            logger.error("Invalid value in payload: {}", e)
        except KeyError as e:
            logger.error("Missing key in payload: {}", e)
        return None

    async def load(self, transformed: kafka.KafkaMessageForTelemetry) -> None:
        if not self._kafka_producer:
            raise RuntimeError("Kafka producer is not initialized")
        await self._kafka_producer.send_and_wait(
            topic=self._config.kafka_topic,
            value=transformed.model_dump_json().encode("utf-8"),
            key=transformed.device_id.bytes,
        )

    async def run(self) -> None:
        self._kafka_producer = AIOKafkaProducer(
            bootstrap_servers=f"{self._config.kafka_host}:{self._config.kafka_port}",
            client_id=self._config.kafka_client_id,
        )
        await self._kafka_producer.start()
        logger.info("Connected to Kafka Broker [{}]", self._config.kafka_host)
        async for extracted in self.extract():
            transformed = await self.transform(extracted)
            if transformed:
                await self.load(transformed)
        await self._kafka_producer.stop()
