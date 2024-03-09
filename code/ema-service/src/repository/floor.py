import schemas.models as models
import schemas.rest as rest
from fastapi import HTTPException, status
from repository.connection import get_session
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError, NoResultFound


class FloorRepository:
    @staticmethod
    def _rest_to_model(floor: rest.Floor) -> models.Floor:
        return models.Floor(
            id=floor.id,
            name=floor.name,
        )

    @staticmethod
    def _model_to_rest(floor: models.Floor) -> rest.Floor:
        return rest.Floor(
            id=floor.id,
            name=floor.name,
        )

    def upsert(self, floor: rest.Floor):
        floor_orm = self._rest_to_model(floor)
        with get_session() as session:
            try:
                session.merge(floor_orm)
                session.commit()
                return self._model_to_rest(floor_orm)
            except IntegrityError as e:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    def list(self, name: str, limit: int = -1, offset: int = 0) -> list[rest.Floor]:
        with get_session() as session:
            statement = (
                select(models.Floor)
                .where(models.Floor.name.contains(name))
                .order_by(models.Floor.name)
            )

            if limit >= 0:
                statement = statement.limit(limit)
            if offset > 0:
                statement = statement.offset(offset)

            return [
                self._model_to_rest(floor_orm)
                for floor_orm in session.execute(statement).scalars()
                if isinstance(floor_orm, models.Floor)
            ]

    def read(self, _id: str) -> rest.Floor:
        with get_session() as session:
            try:
                statement = select(models.Floor).where(models.Floor.id == _id)
                return self._model_to_rest(session.execute(statement).scalar_one())
            except NoResultFound:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Floor with id {_id} not found",
                )

    @staticmethod
    def delete(_id: str) -> None:
        with get_session() as session:
            statement = delete(models.Floor).where(models.Floor.id == _id)
            session.execute(statement)
            session.commit()
