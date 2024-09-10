from pydantic import BaseModel
from user.schema import UserBase


class UserLogin(UserBase):
    pass


class UserRegister(UserBase):
    pass


class Tokens(BaseModel):
    access_token: str
