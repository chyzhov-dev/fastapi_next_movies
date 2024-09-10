from http import HTTPStatus
from fastapi import Depends, HTTPException
from auth.password_service import get_password_service, PasswordService
from user.repository import UserRepository, get_user_repository
from user.schema import UserRead
from auth.schema import UserRegister
from util.decorators import with_error_logger


class UserService:
    def __init__(
        self,
        repo: UserRepository,
        password_service: PasswordService,
    ):
        self.user_repository = repo
        self.password_service = password_service

    def check_exists(self, email: str):
        db_user = self.user_repository.get_by_email(email)
        if db_user:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail=f"User with email: {email} already exists"
            )

    @with_error_logger
    def create(self, entity: UserRegister):
        self.check_exists(entity.email)

        entity.password = self.password_service.get_hash_password(
            entity.password)
        db_user = self.user_repository.create(entity)
        return UserRead.model_validate(db_user)


def get_user_service(
    repo: UserRepository = Depends(get_user_repository),
    password_service: PasswordService = Depends(get_password_service)
):
    return UserService(repo, password_service)
