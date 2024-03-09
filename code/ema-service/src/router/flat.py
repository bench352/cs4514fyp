import uuid
from typing import Annotated

import logic.flat
import repository.flat as flat_repo
from fastapi import APIRouter, Depends, Path, Query, status
from fastapi.responses import Response
from logic.authorize import AuthorizationClient
from schemas import internal, rest

router = APIRouter(prefix="/flats", tags=["Flats"])
flat_repo = flat_repo.FlatRepository()


@router.put("", dependencies=[Depends(AuthorizationClient("flats", "write"))])
def create_or_update_flat(flat: rest.Flat):
    return flat_repo.upsert(flat)


@router.get("")
def list_flats(
    decoded_user: Annotated[
        internal.DecodedUserDetail, Depends(AuthorizationClient("flats", "read"))
    ],
    name: str = Query(
        default="", description="Filter by device name that contains this string"
    ),
    limit: int = Query(default=-1, description="Limit the number of results returned"),
    offset: int = Query(default=0, description="Offset the results returned"),
    floor_id: uuid.UUID | None = Query(default=None, description="Filter by floor id"),
) -> list[rest.Flat]:
    return logic.flat.list_flats(name, limit, offset, floor_id, decoded_user)


@router.get("/{id}")
def read_flat(
    decoded_user: Annotated[
        internal.DecodedUserDetail, Depends(AuthorizationClient("flats", "read"))
    ],
    _id: str = Path(alias="id"),
) -> rest.Flat:
    return logic.flat.read_flat(_id, decoded_user)


@router.delete("/{id}", dependencies=[Depends(AuthorizationClient("flats", "write"))])
def remove_flat(_id: str = Path(alias="id"), purge_devices: bool = False) -> Response:
    flat_repo.delete(_id, purge_devices)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
