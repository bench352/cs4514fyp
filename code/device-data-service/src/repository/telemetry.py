import uuid
from collections import defaultdict, deque
from datetime import datetime

from fastapi.exceptions import HTTPException
from loguru import logger
from psycopg_pool import AsyncConnectionPool
from schemas.telemetry import TelemetryDataPoint, TelemetryData, TelemetryKeyValues

from env import TimescaleDBConfig


class TelemetryRepository:
    _pool: AsyncConnectionPool | None = None
    _config = TimescaleDBConfig()

    @classmethod
    async def init_connection_pool(cls):
        logger.info(
            "Initializing connection pool to [{}:{}]",
            cls._config.timescaledb_host,
            cls._config.timescaledb_port,
        )
        cls._pool = AsyncConnectionPool(
            f"postgresql://{cls._config.timescaledb_user}:{cls._config.timescaledb_password}@"
            f"{cls._config.timescaledb_host}:{cls._config.timescaledb_port}/{cls._config.timescaledb_dbname}"
        )

    async def get_historical_data(
        self, device_id: uuid.UUID, from_ts: datetime, to_ts: datetime
    ) -> TelemetryData:
        if self._pool is None:
            raise HTTPException(
                status_code=500,
                detail="Connection to the database has not been initialized!",
            )
        async with self._pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    f"""
                    SELECT key, timestamp, value
                    FROM telemetry
                    WHERE device_id = '{device_id}'
                    AND timestamp >= '{from_ts}'
                    AND timestamp <= '{to_ts}'
                    ORDER BY key, timestamp ASC
                    """
                )
                rows = await cur.fetchall()
                key_values: dict[str, deque[TelemetryDataPoint]] = defaultdict(deque)
                for row in rows:
                    key_values[row[0]].append(
                        TelemetryDataPoint(timestamp=row[1], value=row[2])
                    )

                return TelemetryData(
                    device_id=device_id,
                    data=[
                        TelemetryKeyValues(key=key, values=list(values))
                        for key, values in key_values.items()
                    ],
                )

    async def get_realtime_data(self, device_id: uuid.UUID) -> TelemetryData:
        if self._pool is None:
            raise HTTPException(
                status_code=500,
                detail="Connection to the database has not been initialized!",
            )
        async with self._pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    f"""
                    SELECT key, timestamp, value
                    FROM telemetry
                    WHERE device_id = '{device_id}'
                    ORDER BY key, timestamp DESC
                    LIMIT 1
                    """
                )
                rows = await cur.fetchall()
                key_values: dict[str, deque[TelemetryDataPoint]] = defaultdict(deque)
                for row in rows:
                    key_values[row[0]].append(
                        TelemetryDataPoint(timestamp=row[1], value=row[2])
                    )

                return TelemetryData(
                    device_id=device_id,
                    data=[
                        TelemetryKeyValues(key=key, values=list(values))
                        for key, values in key_values.items()
                    ],
                )
