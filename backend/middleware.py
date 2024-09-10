from fastapi import Cookie, Depends, Request
from auth.auth_service import AuthService, get_auth_service
from typing import Annotated
from auth.schema import Tokens
from main import app


@app.middleware("http")
async def rotate_tokens(
    call_next,
    request: Request,
    access_token: Annotated[str | None, Cookie()] = None,
    auth_service: AuthService = Depends(get_auth_service),
):
    if access_token is None:
        return call_next(request)

    response = call_next(request)
    tokens = auth_service.rotate_tokens(Tokens(access_token=access_token))
    response.set_cookie(key="Authorization", value=f"{tokens.access_token}")

    return response
