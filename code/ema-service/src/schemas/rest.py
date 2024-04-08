import uuid
from typing import Optional

from pydantic import BaseModel, Field, constr
from schemas.enums import Role, TokenType


class Floor(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: constr(min_length=1)


class Flat(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: constr(min_length=1)
    floor_id: uuid.UUID


class Device(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: constr(min_length=1)
    display_name: str = ""
    description: str = ""
    flat_id: uuid.UUID


class UserCreate(BaseModel):
    username: constr(min_length=1)
    full_name: str
    init_password: constr(min_length=1)
    role: Role


class User(BaseModel):
    id: uuid.UUID
    username: constr(min_length=1)
    full_name: str
    role: Role
    flat: Optional[Flat] = None


class UserUpdate(BaseModel):
    id: uuid.UUID
    username: constr(min_length=1)
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
    new_password: constr(min_length=1)
