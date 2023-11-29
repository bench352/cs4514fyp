import uuid

from logic.authenticate import _hash_password
from repository.user import UserRepository
from schemas import rest, internal

user_repository = UserRepository()


def _rest_create_to_internal(user_create: rest.UserCreate) -> internal.UserDetail:
    return internal.UserDetail(
        id=uuid.uuid4(),
        username=user_create.username,
        full_name=user_create.full_name,
        hashed_password=_hash_password(user_create.init_password),
        role=user_create.role,
    )


def _internal_to_rest(user: internal.UserDetail) -> rest.User:
    return rest.User(
        id=user.id,
        username=user.username,
        full_name=user.full_name,
        role=user.role,
        flat=rest.Flat(
            id=user.flat.id, name=user.flat.name, floor_id=user.flat.floor_id
        )
        if user.flat
        else None,
    )


def create_new_user(user_create: rest.UserCreate) -> rest.User:
    internal_user = _rest_create_to_internal(user_create)
    return user_repository.create(internal_user)


def list_users(
    username: str, full_name: str, limit: int = -1, offset: int = 0
) -> list[rest.User]:
    return [
        _internal_to_rest(user)
        for user in user_repository.list(username, full_name, limit, offset)
    ]


def read_user(_id: uuid.UUID) -> rest.User:
    return _internal_to_rest(user_repository.read(_id))


def update_user(user_update: rest.UserUpdate) -> rest.User:
    return _internal_to_rest(user_repository.update(user_update))


def delete_user(_id: uuid.UUID) -> None:
    user_repository.delete(_id)
