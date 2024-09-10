import config
from datetime import datetime, timedelta
from typing import Any, Optional
from jose import jwt
from util.decorators import with_error_logger


class JwtService:
    ALGORITHM = config.ALGORITHM
    SECRET_KEY = config.SECRET_KEY
    ACCESS_TOKEN_EXPIRE_MINUTES = config.ACCESS_TOKEN_EXPIRE_MINUTES

    @with_error_logger
    def decode_token(self, token):
        try:
            data = jwt.decode(
                token=token,
                key=self.SECRET_KEY,
                algorithms=self.ALGORITHM
            )

            return data['payload']
        except Exception:
            return None

    @with_error_logger
    def create_access_token(
        self,
        subject: str,
        payload: Any,
        expires_delta: Optional[timedelta] = None
    ):
        if expires_delta:
            expire = datetime.now() + expires_delta
        else:
            expire = datetime.now() + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)

        to_encode = {
            "exp": expire,
            "sub": str(subject),
            "payload": payload
        }

        encoded_jwt = jwt.encode(
            to_encode,
            self.SECRET_KEY,
            algorithm=self.ALGORITHM
        )

        return encoded_jwt


def get_jwt_service():
    return JwtService()
