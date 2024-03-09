import asyncio
import uuid

from fastapi import APIRouter, Depends
from logic.sub_manager import SubscriptionManager
from schemas.rest import (
    AnomalyData,
    AnomalyDataPayload,
    AnomalyDataPoint,
    AnomalyKeyValues,
)

router = APIRouter(prefix="", tags=["Post Data"])
from logic.authorize import APIKeyAuthenticationClient

sub_manager = SubscriptionManager.get_instance()


@router.post(
    "/devices/{device_id}/anomaly", dependencies=[Depends(APIKeyAuthenticationClient())]
)
async def post_anomaly_data(device_id: uuid.UUID, anomaly_data: AnomalyDataPayload):
    client_format = AnomalyData(
        device_id=device_id,
        data=[
            AnomalyKeyValues(
                key=anomaly_data.key,
                values=[
                    AnomalyDataPoint(
                        timestamp=anomaly_data.timestamp,
                        is_anomaly=anomaly_data.is_anomaly,
                    )
                ],
            )
        ],
    )
    json_data = client_format.model_dump_json()
    await asyncio.create_task(sub_manager.broadcast(str(device_id), json_data))
