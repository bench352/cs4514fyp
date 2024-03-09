from pydantic_settings import BaseSettings


class ServerConfig(BaseSettings):
    port: int = 8000
    reload: bool = False
    path_prefix: str = ""


class TimescaleDBConfig(BaseSettings):
    timescaledb_host: str
    timescaledb_port: int
    timescaledb_user: str
    timescaledb_password: str
    timescaledb_dbname: str


class AuthConfig(BaseSettings):
    jwt_secret: str
    x_api_key: str = ""


class EMAServiceConfig(BaseSettings):
    ema_service_url: str
