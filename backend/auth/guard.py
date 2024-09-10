from http import HTTPStatus
from fastapi import Depends, HTTPException
from auth.auth_service import get_principal
from typing import Callable, Optional


def with_auth(
    predicate: Optional[Callable[..., bool]] = None,
):
    def validate(
        current_user=Depends(get_principal),
        allow_access=Depends(predicate if predicate else lambda: True)
    ):
        if not current_user:
            raise HTTPException(
                status_code=HTTPStatus.FORBIDDEN,
                detail="Not authenticated"
            )

        if not allow_access:
            raise HTTPException(
                status_code=HTTPStatus.FORBIDDEN,
                detail="Not enought priviliges"
            )

        return current_user

    return validate


def guest_only():
    def validate(current_user=Depends(get_principal)):
        if current_user:
            raise HTTPException(
                status_code=HTTPStatus.FORBIDDEN,
                detail="Trying to access guest only route"
            )

        return current_user

    return validate
