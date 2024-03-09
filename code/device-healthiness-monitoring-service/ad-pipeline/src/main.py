import json
from typing import Generator

import ad_model_manager
import env
import httpx
import pendulum
import psycopg2.pool
import schemas
from confluent_kafka import Consumer, KafkaException
from loguru import logger
from pydantic import ValidationError

kafka_settings = env.KafkaSettings()
timescaledb_settings = env.TimescaleDBSettings()
webserver_settings = env.DeviceHealthMonitoringServiceSettings()
model_manager = ad_model_manager.ADModelManager()

kafka_consumer = Consumer(
    {
        "bootstrap.servers": f"{kafka_settings.kafka_host}:{kafka_settings.kafka_port}",
        "group.id": kafka_settings.consumer_group,
        # 'security.protocol': 'SASL_PLAINTEXT',
        # 'sasl.mechanism': 'PLAIN',
        # 'sasl.username': kafka_settings.kafka_username,
        # 'sasl.password': kafka_settings.kafka_password,
        "auto.offset.reset": "earliest",
        "enable.auto.commit": "false",
    }
)

db_conn_pool = psycopg2.pool.SimpleConnectionPool(
    host=timescaledb_settings.timescaledb_host,
    port=timescaledb_settings.timescaledb_port,
    user=timescaledb_settings.timescaledb_user,
    password=timescaledb_settings.timescaledb_password,
    dbname=timescaledb_settings.timescaledb_dbname,
    minconn=1,
    maxconn=1000,
)


def _extract() -> Generator[str, None, None]:
    kafka_consumer.subscribe([kafka_settings.kafka_topic])
    logger.info(
        "Subscribed to [{}] on Kafka Broker [{}]",
        kafka_settings.kafka_topic,
        kafka_settings.kafka_host,
    )
    while True:
        message = kafka_consumer.poll(0.1)
        if message is None:
            continue
        if message.error():
            raise KafkaException(message.error())
        logger.debug(f"Received message: {message.value().decode('utf-8')}")
        yield message.value().decode("utf-8")


def _transform(data: str) -> schemas.TelemetryData | None:
    try:
        json_data = json.loads(data)
        timestamp = json_data.pop("timestamp")
        return schemas.TelemetryData(**json_data, timestamp=pendulum.parse(timestamp))
    except json.JSONDecodeError:
        logger.error(f"Received message is not a valid JSON: {data}")
        return None
    except ValidationError as e:
        logger.error(f"Invalid data: {e}")
        return None


def _predict(data: schemas.TelemetryData) -> schemas.AnomalyDetectionResult:
    result = model_manager.predict(data)
    return schemas.AnomalyDetectionResult(
        device_id=data.device_id,
        key=data.key,
        timestamp=data.timestamp,
        is_anomaly=result,
    )


def _load_to_web_server(result: schemas.AnomalyDetectionResult):
    r = httpx.post(
        f"{webserver_settings.service_url}/api/internal/devices/{result.device_id}/anomaly",
        headers={
            "x-api-key": webserver_settings.x_api_key,
        },
        json={
            "timestamp": result.timestamp.isoformat(),
            "key": result.key,
            "isAnomaly": result.is_anomaly,
        },
    )
    if r.is_error:
        logger.error(
            f"Failed to load result to web server. Status code: {r.status_code}, Response: {r.text}"
        )


def _load_to_database(result: schemas.AnomalyDetectionResult):
    conn = db_conn_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO anomaly (device_id, key, timestamp, is_anomaly) VALUES (%s, %s, %s, %s)",
                (
                    str(result.device_id),
                    result.key,
                    result.timestamp,
                    result.is_anomaly,
                ),
            )
            logger.debug(f"Inserted result to database. Result: {result}")
            conn.commit()
    finally:
        db_conn_pool.putconn(conn)


def run_pipeline():
    for telemetry_data in _extract():
        transformed_data = _transform(telemetry_data)
        if transformed_data is None:
            continue
        try:
            result = _predict(transformed_data)
            print(result)
            _load_to_web_server(result)
            _load_to_database(result)
        except Exception as e:
            logger.error(f"An error occurred while processing data: {e}")
        kafka_consumer.commit()


if __name__ == "__main__":
    run_pipeline()
