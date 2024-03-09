from pydantic_settings import BaseSettings


class KafkaSettings(BaseSettings):
    kafka_host: str
    kafka_port: int
    kafka_username: str
    kafka_password: str
    kafka_topic: str
    consumer_group: str
    kafka_auth_enabled: bool = True


class TimescaleDBSettings(BaseSettings):
    timescaledb_host: str
    timescaledb_port: int
    timescaledb_user: str
    timescaledb_password: str
    timescaledb_dbname: str


class DeviceHealthMonitoringServiceSettings(BaseSettings):
    service_url: str
    x_api_key: str
