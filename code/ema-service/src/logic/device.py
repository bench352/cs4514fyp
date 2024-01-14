import uuid

from fastapi import HTTPException, status
from repository.device import DeviceRepository
from repository.user import UserRepository
from schemas.enums import Role

from schemas import internal, rest

device_repo = DeviceRepository()
user_repo = UserRepository()


def list_devices(
    name: str,
    limit: int,
    offset: int,
    flat_id: uuid.UUID | None,
    decoded_user: internal.DecodedUserDetail,
) -> list[rest.Device]:
    if decoded_user.role == Role.LANDLORD:
        return device_repo.list(name, flat_id, limit, offset)
    else:
        user_detail = user_repo.read_by_username(decoded_user.username)
        if user_detail.flat is None:
            return []
        return device_repo.list(name, user_detail.flat.id, limit, offset)


def read_device(_id: str, decoded_user: internal.DecodedUserDetail) -> rest.Device:
    if decoded_user.role == Role.LANDLORD:
        return device_repo.read(_id)
    else:
        user_detail = user_repo.read_by_username(decoded_user.username)
        if user_detail.flat is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        device = device_repo.read(_id)
        if device.flat_id != user_detail.flat.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return device
