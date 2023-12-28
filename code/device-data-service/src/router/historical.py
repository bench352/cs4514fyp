import uuid
from datetime import datetime

from fastapi import APIRouter, Path, Query

from repository.telemetry import TelemetryRepository
from schemas.telemetry import TelemetryData

router = APIRouter(prefix="", tags=["Historical"])
telemetry_repo = TelemetryRepository()


@router.get("/devices/{id}/historical")
async def list_historical_data(
    from_ts: datetime,
    to_ts: datetime = Query(default_factory=datetime.utcnow),
    _id: uuid.UUID = Path(alias="id"),
) -> TelemetryData:
    return await telemetry_repo.get_historical_data(_id, from_ts, to_ts)
