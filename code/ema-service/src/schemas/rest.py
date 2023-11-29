import uuid
from typing import Optional

from pydantic import BaseModel, Field

from schemas.enums import Role, TokenType


class Floor(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: str


class Flat(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: str
    floor_id: uuid.UUID


class Device(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: str
    display_name: str = ""
    description: str = ""
    flat_id: uuid.UUID


class UserCreate(BaseModel):
    username: str
    full_name: str
    init_password: str
    role: Role


class User(BaseModel):
    id: uuid.UUID
    username: str
    full_name: str
    role: Role
    flat: Optional[Flat] = None


class UserUpdate(BaseModel):
    id: uuid.UUID
    username: str
    full_name: str
    role: Role


class UserFlat(BaseModel):
    flat_id: uuid.UUID


class TokenResponse(BaseModel):
    access_token: str
    token_type: TokenType = TokenType.BEARER
    expires_in: int


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str
