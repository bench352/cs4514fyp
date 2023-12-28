import uuid

from fastapi import APIRouter, Path, WebSocket, WebSocketDisconnect
from loguru import logger

from logic.sub_manager import SubscriptionManager
from repository.telemetry import TelemetryRepository
from schemas.telemetry import TelemetryData

telemetry_repo = TelemetryRepository()
sub_manager = SubscriptionManager.get_instance()

router = APIRouter(prefix="", tags=["Real Time"])


@router.get("/devices/{id}/real-time")
async def list_real_time_data(
    _id: uuid.UUID = Path(alias="id"),
) -> TelemetryData:
    return await telemetry_repo.get_realtime_data(_id)


@router.websocket("/devices/{device_id}/real-time")
async def real_time_websocket_subscription(
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
