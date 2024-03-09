import uuid

import schemas.models as models
import schemas.rest as rest
from fastapi import HTTPException, status
from repository.connection import get_session
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError, NoResultFound


class FlatRepository:
    def _rest_to_model(self, flat: rest.Flat) -> models.Flat:
        return models.Flat(
            id=flat.id,
            name=flat.name,
            floor_id=flat.floor_id,
        )

    def _model_to_rest(self, flat: models.Flat) -> rest.Flat:
        return rest.Flat(
            id=flat.id,
            name=flat.name,
            floor_id=flat.floor_id,
        )

    def upsert(self, flat: rest.Flat):
        flat_orm = self._rest_to_model(flat)
        with get_session() as session:
            try:
                session.merge(flat_orm)
                session.commit()
                return self._model_to_rest(flat_orm)
            except IntegrityError as e:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    def list(
        self,
        name: str,
        floor_id: uuid.UUID | None,
        limit: int = -1,
        offset: int = 0,
        username: str = "",
    ) -> list[rest.Flat]:
        with get_session() as session:
            if username != "":
                user_orm = session.execute(
                    select(models.User).where(models.User.username == username)
                ).scalar_one()

            statement = (
                select(models.Flat)
                .where(models.Flat.name.contains(name))
                .order_by(models.Flat.name)
            )

            if limit >= 0:
                statement = statement.limit(limit)
            if offset > 0:
                statement = statement.offset(offset)
            if floor_id is not None:
                statement = statement.where(models.Flat.floor_id == floor_id)
            if username != "":
                statement = statement.where(models.Flat.users.contains(user_orm))

            return [
                self._model_to_rest(flat_orm)
                for flat_orm in session.execute(statement).scalars()
                if isinstance(flat_orm, models.Flat)
            ]

    def read(self, _id: str) -> rest.Flat:
        with get_session() as session:
            try:
                statement = select(models.Flat).where(models.Flat.id == _id)
                return self._model_to_rest(session.execute(statement).scalar_one())
            except NoResultFound:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Flat with id [{_id}] not found",
                )

    def delete(self, _id: str, purge_devices: bool = False) -> None:
        with get_session() as session:
            try:
                if purge_devices:
                    statement = delete(models.Device).where(
                        models.Device.flat_id == _id
                    )
                    session.execute(statement)
                statement = delete(models.Flat).where(models.Flat.id == _id)
                session.execute(statement)
                session.commit()
            except IntegrityError:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Flat with id [{_id}] is in use by one or more devices and cannot be deleted",
                )
