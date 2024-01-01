import repository.floor as floor_repo
from fastapi import APIRouter, Path, Query, status, Depends
from fastapi.responses import Response
from logic import authorize

from schemas import rest

router = APIRouter(prefix="/floors", tags=["Floors"])
floor_repo = floor_repo.FloorRepository()

RESOURCE = "floors"


@router.put(
    "", dependencies=[Depends(authorize.AuthorizationClient(RESOURCE, "write"))]
)
def create_or_update_floor(floor: rest.Floor) -> rest.Floor:
    return floor_repo.upsert(floor)


@router.get("", dependencies=[Depends(authorize.AuthorizationClient(RESOURCE, "read"))])
def list_floors(
    name: str = Query(
        default="", description="Filter by device name that contains this string"
    ),
    limit: int = Query(default=-1, description="Limit the number of results returned"),
    offset: int = Query(default=0, description="Offset the results returned"),
) -> list[rest.Floor]:
    return floor_repo.list(name, limit, offset)


@router.get(
    "/{id}", dependencies=[Depends(authorize.AuthorizationClient(RESOURCE, "read"))]
)
def read_floor(_id: str = Path(alias="id")) -> rest.Floor:
    return floor_repo.read(_id)


@router.delete(
    "/{id}", dependencies=[Depends(authorize.AuthorizationClient(RESOURCE, "write"))]
)
def remove_floor(_id: str = Path(alias="id")) -> Response:
    floor_repo.delete(_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
