from http import HTTPStatus
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from starlette.requests import Request
from auth.jwt_service import JwtService, get_jwt_service
from auth.password_service import PasswordService, get_password_service
from user.repository import UserRepository, get_user_repository
from user.model import User
from auth.schema import Tokens, UserRegister

security_scheme = HTTPBearer()


class AuthService:
    def __init__(
        self,
        jwt_service: JwtService,
        user_repository: UserRepository,
        password_service: PasswordService,
    ):
        self.jwt_service = jwt_service
        self.user_repository = user_repository
        self.password_service = password_service

    def authenticate_user(self, email, password):
        db_user = self.user_repository.get_by_email(email)
        if not db_user:
            return None

        if not self.password_service.verify_password(
            password, db_user.password
        ):
            return None

        return db_user

    def authenticate_oauth_user(self, email):
        db_user = self.user_repository.get_by_email(email)
        if not db_user:
            return self.user_repository.create(
                UserRegister(email=email, password="")
            )

        return db_user

    def rotate_tokens(self, tokens: Tokens):
        decoded_payload = self.jwt_service.decode_token(tokens.access_token)
        if not decoded_payload:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Invalid token"
            )

        db_user = self.user_repository.get_by_id(decoded_payload['id'])
        if not db_user:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="No user found"
            )

        payload = {
            "id": db_user.id,
            "email": db_user.email,
        }

        token = self.jwt_service.create_access_token(
            subject=str(db_user.id),
            payload=payload
        )

        return Tokens(access_token=token)

    def get_tokens(
        self,
        result: User | None,
    ):
        if not result:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        payload = {
            "id": result.id,
            "email": result.email,
        }

        token = self.jwt_service.create_access_token(
            subject=str(result.id),
            payload=payload
        )

        return Tokens(access_token=token)


def get_auth_service(
    jwt_service=Depends(get_jwt_service),
    user_repository=Depends(get_user_repository),
    password_service=Depends(get_password_service),
):
    return AuthService(
        jwt_service,
        user_repository,
        password_service,
    )


def get_token_payload(
    req: Request,
    jwt_service: JwtService = Depends(get_jwt_service),
):
    print(req.cookies)
    cookie_token = req.cookies.get('access_token')

    if cookie_token:
        return jwt_service.decode_token(cookie_token)


def get_principal(
    payload: dict = Depends(get_token_payload),
    user_service: UserRepository = Depends(get_user_repository)
):
    if payload and 'id' in payload:
        return user_service.get_by_id(payload['id'])

    return None
