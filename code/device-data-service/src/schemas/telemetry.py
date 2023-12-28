import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TelemetryDataPoint(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    timestamp: datetime
    value: float


class TelemetryKeyValues(BaseModel):
    key: str
    values: list[TelemetryDataPoint]


class TelemetryData(BaseModel):
    device_id: uuid.UUID
    data: list[TelemetryKeyValues]
