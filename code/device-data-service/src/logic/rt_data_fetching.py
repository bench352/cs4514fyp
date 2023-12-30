import uuid

import orjson
from aiokafka import AIOKafkaConsumer
from loguru import logger

from env import KafkaConfig
from logic.sub_manager import SubscriptionManager
from schemas.telemetry import TelemetryData, TelemetryKeyValues, TelemetryDataPoint

sub_manager = SubscriptionManager.get_instance()
kafka_config = KafkaConfig()


async def _transform_and_broadcast(msg: bytes):
    data = orjson.loads(msg)
    _id = data["device_id"]
    telemetry_data = TelemetryData(
        device_id=uuid.UUID(_id),
        data=[
            TelemetryKeyValues(
                key=data["key"],
                values=[
                    TelemetryDataPoint(
                        timestamp=data["timestamp"],
                        value=data["value"],
                    )
                ],
            )
        ],
    )
    await sub_manager.broadcast(_id, telemetry_data.model_dump_json())


async def fetch_data_in_background():
    consumer = AIOKafkaConsumer(
        kafka_config.kafka_topic,
        bootstrap_servers=f"{kafka_config.kafka_host}:{kafka_config.kafka_port}",
        group_id=kafka_config.kafka_client_id,
    )
    await consumer.start()
    logger.info(
        f"Connected to Kafka at {kafka_config.kafka_host}:{kafka_config.kafka_port}"
    )
    try:
        async for msg in consumer:
            await _transform_and_broadcast(msg.value)
    finally:
        await consumer.stop()
