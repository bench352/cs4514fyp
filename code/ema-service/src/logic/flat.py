import uuid

from fastapi import HTTPException, status
from repository.flat import FlatRepository
from repository.user import UserRepository
from schemas.enums import Role

from schemas import internal, rest

flat_repository = FlatRepository()
user_repository = UserRepository()


def list_flats(
    name: str,
    limit: int,
    offset: int,
    floor_id: uuid.UUID | None,
    decoded_user: internal.DecodedUserDetail,
) -> list[rest.Flat]:
    if decoded_user.role == Role.LANDLORD:
        return flat_repository.list(name, floor_id, limit, offset)
    else:
        return flat_repository.list(
            name, floor_id, limit, offset, decoded_user.username
        )


def read_flat(_id: str, decoded_user: internal.DecodedUserDetail) -> rest.Flat:
    if decoded_user.role == Role.LANDLORD:
        return flat_repository.read(_id)
    else:
        user_detail = user_repository.read_by_username(decoded_user.username)
        if user_detail.flat is None or user_detail.flat.id != uuid.UUID(_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return flat_repository.read(_id)
