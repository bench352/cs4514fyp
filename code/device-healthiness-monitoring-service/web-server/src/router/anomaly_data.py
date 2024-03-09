import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from logic.authorize import RestAuthorizationClient
from repository.anomaly import AnomalyRepository
from schemas.rest import AnomalyData

router = APIRouter(prefix="", tags=["Anomaly Data"])
anomaly_repo = AnomalyRepository()


@router.get(
    "/devices/{device_id}/historical", dependencies=[Depends(RestAuthorizationClient())]
)
async def get_historical_anomaly_detection_result(
    device_id: uuid.UUID,
    from_ts: datetime,
    to_ts: datetime = Query(default_factory=datetime.utcnow),
) -> AnomalyData:
    return await anomaly_repo.get_historical_data(device_id, from_ts, to_ts)
