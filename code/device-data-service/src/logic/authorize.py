import uuid
from typing import Annotated

import jwt
from cachetools import TTLCache, cached
from fastapi import HTTPException, status, Depends, WebSocketException
from fastapi.security import HTTPBearer

from env import AuthConfig
from repository.ema_service import EMAServiceClient
from schemas import internal

oauth2_scheme = HTTPBearer()
ema_service_client = EMAServiceClient()

_auth_config = AuthConfig()


def authenticate_user(token: str) -> internal.DecodedUserDetail:
    try:
        payload = jwt.decode(
            token,
            _auth_config.jwt_secret,
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


class RestAuthorizationClient:
    async def __call__(
        self, _id: uuid.UUID, token: Annotated[str, Depends(oauth2_scheme)]
    ):
        authenticate_user(token)
        devices_granted_to_user = await self._get_device_ids_granted_to_user(token)
        if str(_id) not in devices_granted_to_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Device with ID [{_id}] not found",
            )

    @cached(cache=TTLCache(maxsize=1024, ttl=60))
    async def _get_device_ids_granted_to_user(self, token: str) -> set[str]:
        return await ema_service_client.list_device_ids(token)


class WebsocketAuthorizationClient:
    async def __call__(self, token: str, _id: uuid.UUID):
        authenticate_user(token)
        device_granted_to_user = await _get_device_ids_granted_to_user(token)
        if str(_id) not in device_granted_to_user:
            raise WebSocketException(
                code=status.WS_1008_POLICY_VIOLATION,
                reason=f"Device with ID [{_id}] not found",
            )


@cached(cache=TTLCache(maxsize=1024, ttl=60))
async def _get_device_ids_granted_to_user(self, token: str) -> set[str]:
    return await ema_service_client.list_device_ids(token)
