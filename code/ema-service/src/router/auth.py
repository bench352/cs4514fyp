from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from fastapi.security import OAuth2PasswordRequestForm
from repository.user import UserRepository

from logic import authenticate
from schemas import internal, rest

router = APIRouter(prefix="/auth", tags=["authenticate"])
user_repo = UserRepository()


@router.post("/login")
def login(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> rest.TokenResponse:
    return authenticate.login(form_data.username, form_data.password)


@router.get("/me")
def read_user(
        user_detail: Annotated[
            internal.DecodedUserDetail, Depends(authenticate.authenticate_user)
        ]
) -> rest.User:
    internal_user = user_repo.read_by_username(user_detail.username)

    return rest.User(
        id=internal_user.id,
        username=internal_user.username,
        full_name=internal_user.full_name,
        role=internal_user.role,
        flat=None
    )


@router.put("/password")
def update_password(
        user_detail: Annotated[
            internal.DecodedUserDetail, Depends(authenticate.authenticate_user)
        ],
        update_payload: rest.PasswordUpdate,
) -> Response:
    authenticate.update_password(
        user_detail.username,
        update_payload.current_password,
        update_payload.new_password,
    )
    return Response(status_code=204)
