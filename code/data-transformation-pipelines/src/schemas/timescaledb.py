import uuid

import pendulum
from pydantic import BaseModel, ConfigDict


class EntriesForDatabase(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    device_id: uuid.UUID
    timestamp: pendulum.DateTime
    key: str
    value: float
