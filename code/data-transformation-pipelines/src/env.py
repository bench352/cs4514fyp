from pydantic_settings import BaseSettings


class MQTTToKafkaSettings(BaseSettings):
    mqtt_host: str
    mqtt_port: int
    mqtt_username: str
    mqtt_password: str
    mqtt_topic_filter: str

    kafka_host: str
    kafka_port: int
    kafka_username: str
    kafka_password: str
    kafka_topic: str
    kafka_client_id: str
    kafka_auth_enabled: bool = True


class KafkaToTimescaleDBSettings(BaseSettings):
    kafka_host: str
    kafka_port: int
    kafka_username: str
    kafka_password: str
    kafka_topic: str
    consumer_group: str
    kafka_auth_enabled: bool = True

    timescaledb_host: str
    timescaledb_port: int
    timescaledb_user: str
    timescaledb_password: str
    timescaledb_dbname: str


class EMAServiceSettings(BaseSettings):
    ema_url: str
    x_api_key: str
