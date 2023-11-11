import enum
import uuid

from sqlmodel import SQLModel, Field


# Models for permission control

class Scope(enum.Enum):
    CREATE = "CREATE"
    READ = "READ"
    UPDATE = "UPDATE"
    DELETE = "DELETE"


class ResourceType(enum.Enum):
    GROUP = "GROUP"
    DEVICE = "DEVICE"
    USER = "USER"


class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str = Field(unique=True)
    password: str
    full_name: str = ""
    group_id: uuid.UUID = Field(foreign_key="group.id")


class Group(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(unique=True)
    description: str = ""


class ResourceString(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    resource_type: ResourceType
    resource_string: str


class Permission(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    resource_string_id: uuid.UUID = Field(foreign_key="resource_string.id")
    scope: Scope


# Models for the entities

class Floor(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(unique=True)


class Flat(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(unique=True)
    floor_id: uuid.UUID = Field(foreign_key="floor.id")


class Device(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(unique=True)
    display_name: str = Field()
    description: str = ""
    flat_id: uuid.UUID = Field(foreign_key="flat.id")
