from datetime import datetime
from http import HTTPStatus

from typing import Generic, Optional, TypeVar
from pydantic import BaseModel


T = TypeVar('T')


class OrmBase(BaseModel):
    class Config:
        from_attributes = True


class ApiResponse(BaseModel, Generic[T]):
    data: Optional[T] = None
    error: Optional[str] = None
    status: HTTPStatus = HTTPStatus.OK


class TimestampMixin(OrmBase):
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
