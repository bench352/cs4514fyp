import uuid

import orjson
from aiokafka import AIOKafkaConsumer
from env import KafkaConfig
from logic.sub_manager import SubscriptionManager
from loguru import logger
from schemas.telemetry import TelemetryData, TelemetryDataPoint, TelemetryKeyValues

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
        security_protocol="SASL_PLAINTEXT",
        sasl_mechanism="PLAIN",
        sasl_plain_username=kafka_config.kafka_username,
        sasl_plain_password=kafka_config.kafka_password,
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
