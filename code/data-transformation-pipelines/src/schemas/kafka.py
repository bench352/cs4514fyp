import uuid

import pendulum
from pydantic import BaseModel, ConfigDict, field_serializer


class KafkaMessageForTelemetry(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    timestamp: pendulum.DateTime
    device_id: uuid.UUID
    key: str
    value: float

    @field_serializer("timestamp", when_used="always")
    def serialize_timestamp(value):
        return value.to_iso8601_string()
