import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, status
from fastapi.responses import Response
from logic import user
from logic.authorize import AuthorizationClient
from repository.user import UserRepository
from schemas import internal, rest

router = APIRouter(prefix="/users", tags=["Users"])
user_repo = UserRepository()


@router.post("", dependencies=[Depends(AuthorizationClient("users", "write"))])
def create_new_user(new_user: rest.UserCreate) -> rest.User:
    return user.create_new_user(new_user)


@router.get("")
def list_users(
    decoded_user: Annotated[
        internal.DecodedUserDetail, Depends(AuthorizationClient("users", "read"))
    ],
    username: str = Query(
        default="", description="Filter by username that contains this string"
    ),
    full_name: str = Query(
        default="", description="Filter by full name that contains this string"
    ),
    limit: int = Query(default=-1, description="Limit the number of results returned"),
    offset: int = Query(default=0, description="Offset the results returned"),
) -> list[rest.User]:
    return user.list_users(decoded_user, username, full_name, limit, offset)


@router.get("/{id}")
def read_user(
    decoded_user: Annotated[
        internal.DecodedUserDetail, Depends(AuthorizationClient("users", "read"))
    ],
    _id: uuid.UUID = Path(alias="id"),
) -> rest.User:
    return user.read_user(_id, decoded_user)


@router.put("", dependencies=[Depends(AuthorizationClient("users", "write"))])
def update_user(user_update: rest.UserUpdate) -> rest.User:
    return user.update_user(user_update)


@router.delete("/{id}", dependencies=[Depends(AuthorizationClient("users", "write"))])
def delete_user(_id: uuid.UUID = Path(alias="id")) -> Response:
    user.delete_user(_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/users/{id}/flats", dependencies=[Depends(AuthorizationClient("users", "write"))]
)
def add_flat_to_user(
    user_flat: rest.UserFlat, _id: uuid.UUID = Path(alias="id")
) -> Response:
    user_repo.add_user_to_flat(_id, user_flat.flat_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete(
    "/users/{id}/flats", dependencies=[Depends(AuthorizationClient("users", "write"))]
)
def remove_user_from_flat(_id: uuid.UUID = Path(alias="id")) -> Response:
    user_repo.remove_user_from_flat(_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
