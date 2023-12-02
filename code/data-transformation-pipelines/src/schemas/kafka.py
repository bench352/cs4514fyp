import uuid

import pendulum
from pydantic import BaseModel, ConfigDict


class KafkaMessageForTelemetry(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    timestamp: pendulum.DateTime
    device_id: uuid.UUID
    key: str
    value: float
