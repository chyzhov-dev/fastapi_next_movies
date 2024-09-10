from pydantic import BaseModel, EmailStr
from common.schema import OrmBase


class UserRead(OrmBase):
    id: int
    email: EmailStr


class UserBase(BaseModel):
    email: EmailStr
    password: str
