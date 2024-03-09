import datetime
import uuid

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class RestModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class AnomalyDataPayload(RestModel):
    timestamp: datetime.datetime
    key: str
    is_anomaly: bool


class AnomalyDataPoint(RestModel):
    timestamp: datetime.datetime
    is_anomaly: bool


class AnomalyKeyValues(RestModel):
    key: str
    values: list[AnomalyDataPoint]


class AnomalyData(RestModel):
    device_id: uuid.UUID
    data: list[AnomalyKeyValues]
