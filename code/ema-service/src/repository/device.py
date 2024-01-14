import uuid

import schemas.models as models
import schemas.rest as rest
from fastapi import HTTPException, status
from repository.connection import get_session
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError, NoResultFound


class DeviceRepository:
    def _rest_to_model(self, device: rest.Device) -> models.Device:
        return models.Device(
            id=device.id,
            name=device.name,
            display_name=device.display_name,
            description=device.description,
            flat_id=device.flat_id,
        )

    def _model_to_rest(self, device: models.Device) -> rest.Device:
        return rest.Device(
            id=device.id,
            name=device.name,
            display_name=device.display_name,
            description=device.description,
            flat_id=device.flat_id,
        )

    def upsert(self, device: rest.Device):
        device_orm = self._rest_to_model(device)
        with get_session() as session:
            try:
                session.merge(device_orm)
                session.commit()
                return self._model_to_rest(device_orm)
            except IntegrityError as e:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    def list(
        self,
        name: str,
        flat_id: uuid.UUID | None,
        limit: int = -1,
        offset: int = 0,
    ) -> list[rest.Device]:
        with get_session() as session:
            statement = (
                select(models.Device)
                .where(models.Device.name.contains(name))
                .order_by(models.Device.name)
            )

            if limit >= 0:
                statement = statement.limit(limit)
            if offset > 0:
                statement = statement.offset(offset)
            if flat_id is not None:
                statement = statement.where(models.Device.flat_id == flat_id)

            return [
                self._model_to_rest(device_orm)
                for device_orm in session.execute(statement).scalars()
            ]

    def read(self, _id: str) -> rest.Device:
        with get_session() as session:
            try:
                device_orm = session.execute(
                    select(models.Device).where(models.Device.id == _id)
                ).scalar_one()
                return self._model_to_rest(device_orm)
            except NoResultFound:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    def delete(self, _id: str):
        with get_session() as session:
            try:
                session.execute(delete(models.Device).where(models.Device.id == _id))
                session.commit()
            except NoResultFound:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
