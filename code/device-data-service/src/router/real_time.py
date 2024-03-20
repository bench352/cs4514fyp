import uuid

from fastapi import APIRouter, Depends, Path, WebSocket, WebSocketDisconnect, status
from fastapi.exceptions import HTTPException, WebSocketException
from logic.authorize import (
    RestAuthorizationClient,
    WebsocketAuthorizationClient,
    authenticate_user,
)
from logic.sub_manager import SubscriptionManager
from loguru import logger
from repository.ema_service import EMAServiceClient
from repository.telemetry import TelemetryRepository
from schemas.telemetry import TelemetryData
import asyncio

telemetry_repo = TelemetryRepository()
emas_client = EMAServiceClient()
sub_manager = SubscriptionManager.get_instance()

router = APIRouter(prefix="", tags=["Real Time"])


@router.get(
    "/devices/{device_id}/real-time", dependencies=[Depends(RestAuthorizationClient())]
)
async def list_real_time_data(
        device_id: uuid.UUID = Path(),
) -> TelemetryData:
    return await telemetry_repo.get_realtime_data(device_id)


@router.websocket(
    "/devices/{device_id}/real-time",
    dependencies=[Depends(WebsocketAuthorizationClient())],
)
async def subscribe_to_device_real_time_data(
        websocket: WebSocket, device_id: str
) -> None:
    await websocket.accept()
    await sub_manager.subscribe(websocket, device_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        logger.info("Websocket client disconnected")
    finally:
        await sub_manager.unsubscribe(websocket)


@router.websocket("/real-time")
async def subscribe_to_all_real_time_data(websocket: WebSocket, token: str) -> None:
    try:
        authenticate_user(token)
    except HTTPException:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION, reason="Authentication failed"
        )
    await websocket.accept()
    devices = await emas_client.list_device_ids(token)
    tasks = []
    for device_id in devices:
        tasks.append(
            websocket.send_text(
                (await telemetry_repo.get_realtime_data(device_id)).model_dump_json(
                    by_alias=True
                )
            )
        )
        tasks.append(sub_manager.subscribe(websocket, device_id))
    await asyncio.gather(*tasks)
    logger.info("Websocket client subscribed to all devices")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        logger.info("Websocket client disconnected")
    finally:
        await sub_manager.unsubscribe(websocket)
