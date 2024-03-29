import uuid
from typing import Annotated

import logic.device
from fastapi import APIRouter, Depends, Path, Query, status
from fastapi.responses import Response
from logic.authorize import AuthorizationClient
from repository.device import DeviceRepository
from schemas import internal, rest

router = APIRouter(prefix="/devices", tags=["Devices"])
device_repo = DeviceRepository()


@router.put("", dependencies=[Depends(AuthorizationClient("devices", "write"))])
def create_or_update_device(device: rest.Device):
    return device_repo.upsert(device)


@router.get("")
def list_devices(
    decoded_user: Annotated[
        internal.DecodedUserDetail, Depends(AuthorizationClient("devices", "read"))
    ],
    name: str = Query(
        default="", description="Filter by device name that contains this string"
    ),
    limit: int = Query(default=-1, description="Limit the number of results returned"),
    offset: int = Query(default=0, description="Offset the results returned"),
    flat_id: uuid.UUID | None = Query(default=None, description="Filter by flat id"),
) -> list[rest.Device]:
    return logic.device.list_devices(name, limit, offset, flat_id, decoded_user)


@router.get("/{id}")
def read_device(
    decoded_user: Annotated[
        internal.DecodedUserDetail, Depends(AuthorizationClient("devices", "read"))
    ],
    _id: str = Path(alias="id"),
) -> rest.Device:
    return logic.device.read_device(_id, decoded_user)


@router.delete("/{id}", dependencies=[Depends(AuthorizationClient("devices", "write"))])
def remove_device(_id: str = Path(alias="id")) -> Response:
    device_repo.delete(_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
