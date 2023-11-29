import json
from functools import cache
from typing import Annotated

from fastapi import Depends, status, HTTPException

from logic import authenticate
from schemas import internal


@cache
def _get_scope_permission_mapping() -> dict:
    with open("defacto/scope_permit.json") as f:
        return json.load(f)


class AuthorizationClient:
    def __init__(self, resource: str, scope: str):
        self._resource = resource
        self._scope = scope

    def __call__(
        self,
        decoded_user_detail: Annotated[
            internal.DecodedUserDetail, Depends(authenticate.authenticate_user)
        ],
    ):
        if not self._check_role_permission(decoded_user_detail.role.value):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied"
            )
        return decoded_user_detail

    def _check_role_permission(self, role: str):
        resource_map = _get_scope_permission_mapping().get(self._resource, None)
        if resource_map is None:
            return False
        permitted_scopes = resource_map.get(self._scope, None)
        if permitted_scopes is None:
            return False
        return role in permitted_scopes
