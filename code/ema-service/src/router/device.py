import uuid

from fastapi import APIRouter, Path, Query, status
from fastapi.responses import Response

from repository.device import DeviceRepository
from schemas import rest

router = APIRouter(prefix="/devices", tags=["Devices"])
device_repo = DeviceRepository()


@router.put("")
def create_or_update_device(device: rest.Device):
    return device_repo.upsert(device)


@router.get("")
def list_devices(
    name: str = Query(
        default="", description="Filter by device name that contains this string"
    ),
    limit: int = Query(default=-1, description="Limit the number of results returned"),
    offset: int = Query(default=0, description="Offset the results returned"),
    flat_id: uuid.UUID = Query(default=None, description="Filter by flat id"),
) -> list[rest.Device]:
    return device_repo.list(name, flat_id, limit, offset)


@router.get("/{id}")
def read_device(_id: str = Path(alias="id")) -> rest.Device:
    return device_repo.read(_id)


@router.delete("/{id}")
def remove_device(_id: str = Path(alias="id")) -> Response:
    device_repo.delete(_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
