import aiohttp
from aiohttp.client_exceptions import ClientResponseError
from env import EMAServiceConfig
from fastapi import HTTPException


class EMAServiceClient:
    _config = EMAServiceConfig()

    async def list_device_ids(self, user_token: str) -> set[str]:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self._config.ema_service_url}/devices",
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
