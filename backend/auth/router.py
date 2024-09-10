import config
from http import HTTPStatus
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse, Response
from auth.auth_service import AuthService, get_auth_service
from common.schema import ApiResponse
from auth.schema import Tokens, UserRegister, UserLogin
from user.schema import UserRead
from util.decorators import with_api_exception_handling
from auth.guard import guest_only
from user.service import UserService, get_user_service
from auth.google_auth_service import GoogleAuthService, get_google_auth_service

router = APIRouter()


@router.post("/register", response_model=ApiResponse[UserRead])
@with_api_exception_handling
def register(
    entity: UserRegister,
    user_service: UserService = Depends(get_user_service),
    _=Depends(guest_only())
):
    return ApiResponse(
        status=HTTPStatus.CREATED,
        data=user_service.create(entity)
    )


@router.post("/login", response_model=ApiResponse[Tokens])
@with_api_exception_handling
def login(
    response: Response,
    entity: UserLogin,
    auth_service: AuthService = Depends(get_auth_service),
    _=Depends(guest_only())
):
    result = auth_service.authenticate_user(entity.email, entity.password)
    tokens = auth_service.get_tokens(result)

    response.set_cookie(key="access_token", value=f"{tokens.access_token}")

    return ApiResponse(
        status=HTTPStatus.OK,
        data=tokens
    )


@router.post("/verify", response_model=ApiResponse[Tokens])
@with_api_exception_handling
def verify(
    response: Response,
    tokens: Tokens,
    auth_service: AuthService = Depends(get_auth_service),
):
    tokens = auth_service.rotate_tokens(tokens)
    response.set_cookie(key="access_token", value=f"{tokens.access_token}")
    return ApiResponse(
        status=HTTPStatus.OK,
        data=tokens
    )


@router.get("/redirect/google")
@with_api_exception_handling
def google_redirect(
    google_auth_service: GoogleAuthService = Depends(get_google_auth_service),
    _=Depends(guest_only())
):
    authorization_url, _ = google_auth_service.get_authorization_url()
    return RedirectResponse(authorization_url)


@router.get("/callback/google")
@with_api_exception_handling
def google_callback(
    request: Request,
    google_auth_service: GoogleAuthService = Depends(get_google_auth_service),
    auth_service: AuthService = Depends(get_auth_service),
    _=Depends(guest_only())
):
    code = request.query_params.get("code")
    error = request.query_params.get("error")

    if error is not None:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=error
        )

    if code is None:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Code and state are required."
        )

    _, access_token = google_auth_service.get_tokens(code=code)

    user_info = google_auth_service.get_user_info(access_token)
    user_email = user_info["email"]

    result = auth_service.authenticate_oauth_user(user_email)
    tokens = auth_service.get_tokens(result)

    response = RedirectResponse(config.FRONTEND_BASE_URL + "/dashboard/movies")
    response.set_cookie(key="access_token", value=f"{tokens.access_token}")

    return response
