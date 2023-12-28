import aiohttp
from aiohttp.client_exceptions import ClientResponseError
from fastapi import HTTPException

from env import EMAServiceConfig


class EMAServiceClient:
    _config = EMAServiceConfig()

    def __init__(self):
        self._session = aiohttp.ClientSession(base_url=self._config.ema_service_url)

    async def list_device_ids(self, user_token: str) -> set[str]:
        async with self._session.get(
            "/devices",
            headers={"Authorization": f"Bearer {user_token}"},
        ) as resp:
            try:
                resp.raise_for_status()
                return {device["id"] for device in await resp.json()}
            except ClientResponseError as e:
                raise HTTPException(
                    status_code=e.status,
                    detail=e.message,
                ) from e
