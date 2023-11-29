import uuid
from typing import Optional

from pydantic import BaseModel

from schemas import enums


class Flat(BaseModel):
    id: uuid.UUID
    name: str
    floor_id: uuid.UUID


class UserDetail(BaseModel):
    id: uuid.UUID
    username: str
    full_name: str
    hashed_password: str
    role: enums.Role
    flat: Optional[Flat] = None


class DecodedUserDetail(BaseModel):
    username: str
    role: enums.Role
