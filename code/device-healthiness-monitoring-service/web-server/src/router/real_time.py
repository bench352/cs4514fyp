from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from fastapi.exceptions import HTTPException, WebSocketException
from logic.authorize import authenticate_user
from logic.sub_manager import SubscriptionManager
from repository.anomaly import AnomalyRepository
from repository.ema_service import EMAServiceClient

ema_client = EMAServiceClient()
anomaly_repo = AnomalyRepository()
sub_manager = SubscriptionManager.get_instance()

router = APIRouter(prefix="", tags=["Real Time"])
from loguru import logger


@router.websocket("/real-time")
async def subscribe_to_real_time_anomaly_detection(
    websocket: WebSocket, token: str
) -> None:
    try:
        authenticate_user(token)
    except HTTPException:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION, reason="Authentication failed"
        )
    await websocket.accept()
    devices = await ema_client.list_device_ids(token)
    for device_id in devices:
        await websocket.send_text(
            (await anomaly_repo.get_realtime_data(device_id)).model_dump_json(
                by_alias=True
            )
        )
        await sub_manager.subscribe(websocket, device_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        logger.info("Websocket client disconnected")
    finally:
        await sub_manager.unsubscribe(websocket)
