import uuid

from fastapi import HTTPException, status
from repository.connection import get_session
from schemas import internal, models, rest
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError, NoResultFound


class UserRepository:
    def _internal_to_model(self, user: internal.UserDetail) -> models.User:
        return models.User(
            id=user.id,
            username=user.username,
            full_name=user.full_name,
            hashed_password=user.hashed_password,
            role=user.role,
        )

    def _model_to_internal(self, user: models.User) -> internal.UserDetail:
        return internal.UserDetail(
            id=user.id,
            username=user.username,
            full_name=user.full_name,
            hashed_password=user.hashed_password,
            role=user.role,
            flat=internal.Flat(
                id=user.flat.id,
                name=user.flat.name,
                floor_id=user.flat.floor_id,
            )
            if user.flat is not None
            else None,
        )

    def create(self, user: internal.UserDetail):
        user_orm = self._internal_to_model(user)
        with get_session() as session:
            try:
                session.add(user_orm)
                session.commit()
                return self._model_to_internal(user_orm)
            except IntegrityError as e:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    def list(
        self, username: str, full_name: str, limit: int = -1, offset: int = 0
    ) -> list[internal.UserDetail]:
        with get_session() as session:
            statement = (
                select(models.User)
                .where(models.User.username.contains(username))
                .where(models.User.full_name.contains(full_name))
                .order_by(models.User.username)
            )

            if limit >= 0:
                statement = statement.limit(limit)
            if offset > 0:
                statement = statement.offset(offset)

            return [
                self._model_to_internal(user)
                for user in session.execute(statement).scalars()
            ]

    def read(self, _id: uuid.UUID) -> internal.UserDetail:
        with get_session() as session:
            statement = select(models.User).where(models.User.id == _id)
            try:
                return self._model_to_internal(session.execute(statement).scalar_one())
            except NoResultFound:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

    def read_by_username(self, username: str) -> internal.UserDetail:
        with get_session() as session:
            statement = select(models.User).where(models.User.username == username)
            try:
                return self._model_to_internal(session.execute(statement).scalar_one())
            except NoResultFound:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

    def update(self, user_update: rest.UserUpdate) -> internal.UserDetail:
        with get_session() as session:
            statement = select(models.User).where(models.User.id == user_update.id)
            try:
                user_orm = session.execute(statement).scalar_one()
                user_orm.username = user_update.username
                user_orm.full_name = user_update.full_name
                user_orm.role = user_update.role
                session.commit()
                return self._model_to_internal(user_orm)
            except NoResultFound:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

    def update_password(self, username: str, hashed_password: str) -> None:
        with get_session() as session:
            statement = select(models.User).where(models.User.username == username)
            try:
                user_orm = session.execute(statement).scalar_one()
                user_orm.hashed_password = hashed_password
                session.commit()
            except NoResultFound:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

    def delete(self, _id: uuid.UUID):
        with get_session() as session:
            try:
                statement = delete(models.User).where(models.User.id == _id)
                session.execute(statement)
                session.commit()
            except IntegrityError:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="To delete a user, please remove it from the flat first",
                )

    def add_user_to_flat(self, user_id: uuid.UUID, flat_id: uuid.UUID):
        with get_session() as session:
            try:
                user_orm = session.execute(
                    select(models.User).where(models.User.id == user_id)
                ).scalar_one()
                flat_orm = session.execute(
                    select(models.Flat).where(models.Flat.id == flat_id)
                ).scalar_one()
                flat_orm.users.append(user_orm)
                session.commit()
                return self._model_to_internal(user_orm)
            except NoResultFound:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User or flat not found",
                )

    def remove_user_from_flat(self, user_id: uuid.UUID):
        with get_session() as session:
            statement = select(models.User).where(models.User.id == user_id)
            try:
                user_orm = session.execute(statement).scalar_one()
                user_orm.flat = None
                session.commit()
                return self._model_to_internal(user_orm)
            except NoResultFound:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )
