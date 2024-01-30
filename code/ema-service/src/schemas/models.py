import uuid

from sqlalchemy import ForeignKey, String, Enum, Float
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP, BOOLEAN
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from schemas.enums import Role


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "user"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    username: Mapped[str] = mapped_column(String(), unique=True)
    hashed_password: Mapped[str]
    full_name: Mapped[str]
    role: Mapped[Role] = mapped_column(Enum(Role))
    flat: Mapped["Flat"] = relationship(
        "Flat", secondary="user_flat", back_populates="users"
    )


class UserFlat(Base):
    __tablename__ = "user_flat"

    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user.id"), primary_key=True
    )
    flat_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("flat.id"))


# Models for the entities


class Floor(Base):
    __tablename__ = "floor"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(), unique=True)


class Flat(Base):
    __tablename__ = "flat"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(), unique=True)
    floor_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("floor.id"))
    users: Mapped[list[User]] = relationship(
        "User", secondary="user_flat", back_populates="flat"
    )


class Device(Base):
    __tablename__ = "device"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(), unique=True)
    display_name: Mapped[str] = mapped_column(String())
    description: Mapped[str] = mapped_column(String())
    flat_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("flat.id"))


class Telemetry(Base):
    __tablename__ = "telemetry"

    device_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("device.id"), primary_key=True
    )
    timestamp: Mapped[TIMESTAMP] = mapped_column(
        TIMESTAMP(timezone=False), primary_key=True
    )
    key: Mapped[str] = mapped_column(String(), primary_key=True)
    value: Mapped[float] = mapped_column(Float())


class Anomaly(Base):
    __tablename__ = "anomaly"

    device_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("device.id"), primary_key=True
    )
    timestamp: Mapped[TIMESTAMP] = mapped_column(
        TIMESTAMP(timezone=False), primary_key=True
    )
    key: Mapped[str] = mapped_column(String(), primary_key=True)
    is_anomaly: Mapped[bool] = mapped_column(BOOLEAN())
