import uuid

from fastapi import APIRouter, Path, Query, status
from fastapi.responses import Response

from logic import user
from repository.user import UserRepository
from schemas import rest

router = APIRouter(prefix="/users", tags=["Users"])
user_repo = UserRepository()


@router.post("")
def create_new_user(new_user: rest.UserCreate) -> rest.User:
    return user.create_new_user(new_user)


@router.get("")
def list_users(
    username: str = Query(
        default="", description="Filter by username that contains this string"
    ),
    full_name: str = Query(
        default="", description="Filter by full name that contains this string"
    ),
    limit: int = Query(default=-1, description="Limit the number of results returned"),
    offset: int = Query(default=0, description="Offset the results returned"),
) -> list[rest.User]:
    return user.list_users(username, full_name, limit, offset)


@router.get("/{id}")
def read_user(_id: uuid.UUID = Path(alias="id")) -> rest.User:
    return user.read_user(_id)


@router.put("")
def update_user(user_update: rest.UserUpdate) -> rest.User:
    return user.update_user(user_update)


@router.delete("/{id}")
def delete_user(_id: uuid.UUID = Path(alias="id")) -> Response:
    user.delete_user(_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/users/{id}/flats")
def add_flat_to_user(
    user_flat: rest.UserFlat, _id: uuid.UUID = Path(alias="id")
) -> Response:
    user_repo.add_user_to_flat(_id, user_flat.flat_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/users/{id}/flats")
def remove_user_from_flat(_id: uuid.UUID = Path(alias="id")) -> Response:
    user_repo.remove_user_from_flat(_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
