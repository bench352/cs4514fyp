import uuid

import pendulum
from pydantic import BaseModel, ConfigDict


class TelemetryData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    timestamp: pendulum.DateTime
    device_id: uuid.UUID
    key: str
    value: float

    @property
    def model_hash_key(self):
        return f"{self.device_id}_{self.key}"


class AnomalyDetectionResult(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    device_id: uuid.UUID
    key: str
    timestamp: pendulum.DateTime
    is_anomaly: bool
