from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from fastapi.security import OAuth2PasswordRequestForm

from logic import authenticate
from schemas import rest, internal

router = APIRouter(prefix="/auth", tags=["authenticate"])


@router.post("/login")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> rest.TokenResponse:
    return authenticate.login(form_data.username, form_data.password)


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