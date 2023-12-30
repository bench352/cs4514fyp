import uuid
from datetime import datetime

from fastapi import APIRouter, Path, Query, Depends

from logic.authorize import RestAuthorizationClient
from repository.telemetry import TelemetryRepository
from schemas.telemetry import TelemetryData

router = APIRouter(prefix="", tags=["Historical"])
telemetry_repo = TelemetryRepository()


@router.get(
    "/devices/{device_id}/historical", dependencies=[Depends(RestAuthorizationClient())]
)
async def list_historical_data(
    from_ts: datetime,
    to_ts: datetime = Query(default_factory=datetime.utcnow),
    device_id: uuid.UUID = Path(),
) -> TelemetryData:
    return await telemetry_repo.get_historical_data(device_id, from_ts, to_ts)
