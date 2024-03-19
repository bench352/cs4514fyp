import uuid
from collections import defaultdict, deque
from datetime import datetime

from fastapi.exceptions import HTTPException
from loguru import logger
from psycopg_pool import AsyncConnectionPool

import env
from schemas.rest import AnomalyData, AnomalyDataPoint, AnomalyKeyValues


class AnomalyRepository:
    _pool: AsyncConnectionPool | None = None
    _config = env.TimescaleDBConfig()

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

    async def get_realtime_data(self, device_id: str) -> AnomalyData:
        if self._pool is None:
            raise HTTPException(
                status_code=500,
                detail="Connection to the database has not been initialized!",
            )
        async with self._pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    f"""
                    SELECT t.key, t.timestamp, t.is_anomaly
                    FROM anomaly t
                    INNER JOIN (
                        SELECT anomaly.key, MAX(anomaly.timestamp) AS timestamp
                        FROM anomaly
                        WHERE device_id = '{device_id}'
                        GROUP BY anomaly.key
                    ) tm ON t.key = tm.key AND t.timestamp = tm.timestamp
                    WHERE device_id = '{device_id}'
                    ORDER BY key, timestamp DESC
                    """
                )
                rows = await cur.fetchall()
                key_values: dict[str, deque[AnomalyDataPoint]] = defaultdict(deque)
                for row in rows:
                    key_values[row[0]].append(
                        AnomalyDataPoint(timestamp=row[1], is_anomaly=row[2])
                    )
                return AnomalyData(
                    device_id=device_id,
                    data=[
                        AnomalyKeyValues(key=key, values=list(values))
                        for key, values in key_values.items()
                    ],
                )

    async def get_historical_data(
            self,
            device_id: uuid.UUID,
            from_ts: datetime,
            to_ts: datetime,
    ) -> AnomalyData:
        if self._pool is None:
            raise HTTPException(
                status_code=500,
                detail="Connection to the database has not been initialized!",
            )
        async with self._pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    f"""
                    SELECT key, timestamp, is_anomaly
                    FROM anomaly
                    WHERE device_id = '{device_id}'
                    AND timestamp >= '{from_ts}'
                    AND timestamp <= '{to_ts}'
                    ORDER BY key, timestamp ASC
                    """
                )
                rows = await cur.fetchall()
                key_values: dict[str, deque[AnomalyDataPoint]] = defaultdict(deque)
                for row in rows:
                    key_values[row[0]].append(
                        AnomalyDataPoint(timestamp=row[1], is_anomaly=row[2])
                    )
                return AnomalyData(
                    device_id=device_id,
                    data=[
                        AnomalyKeyValues(key=key, values=list(values))
                        for key, values in key_values.items()
                    ],
                )
