import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class RestModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, arbitrary_types_allowed=True
    )


class TelemetryDataPoint(RestModel):
    timestamp: datetime
    value: float


class TelemetryKeyValues(RestModel):
    key: str
    values: list[TelemetryDataPoint]


class TelemetryData(RestModel):
    device_id: uuid.UUID
    data: list[TelemetryKeyValues]
