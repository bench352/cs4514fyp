from typing import Annotated

import bcrypt
import jwt
import pendulum
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from repository.user import UserRepository

import env
from schemas import rest, internal, enums

user_repo = UserRepository()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def _check_password(password: str, hashed_password: str):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _generate_jwt_token(username: str, role: enums.Role) -> (str, int):
    now_time = pendulum.now()
    issued_at = int(now_time.timestamp())
    expires_in = int(now_time.add(minutes=env.JWT_EXPIRE_IN_MINUTES).timestamp())
    headers = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": username,
        "exp": expires_in,
        "iat": issued_at,
        "role": role.value,
    }
    return (
        jwt.encode(
            payload=payload,
            key=env.JWT_SECRET,
            headers=headers,
            algorithm="HS256",
            sort_headers=True,
        ),
        expires_in,
    )


def authenticate_user(
    token: Annotated[str, Depends(oauth2_scheme)]
) -> internal.DecodedUserDetail:
    try:
        payload = jwt.decode(
            token,
            env.JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_signature": True},
        )
        return internal.DecodedUserDetail(
            username=payload["sub"],
            role=payload["role"],
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )


def login(username: str, password: str) -> rest.TokenResponse:
    user_detail = user_repo.read_by_username(username)
    if not _check_password(password, user_detail.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password"
        )
    access_token, expires_in = _generate_jwt_token(username, user_detail.role)
    return rest.TokenResponse(
        access_token=access_token,
        expires_in=expires_in,
    )


def update_password(username: str, original_password: str, new_password: str) -> None:
    user_detail = user_repo.read_by_username(username)
    if not _check_password(original_password, user_detail.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Incorrect password"
        )
    new_hashed_password = _hash_password(new_password)
    user_repo.update_password(username, new_hashed_password)
