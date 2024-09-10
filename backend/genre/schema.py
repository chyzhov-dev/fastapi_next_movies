from typing import List

from pydantic import Field

from common.schema import TimestampMixin, OrmBase
from user.schema import UserRead


class GenreBase(OrmBase):
    name: str = Field(min_length=1, max_length=255)


class GenreReadBase(GenreBase, TimestampMixin):
    id: int
    user: UserRead


class GenreRead(GenreReadBase):
    pass


class GenreList(OrmBase):
    items: List[GenreRead]


class GenrePage(GenreList):
    current_page: int
    total_pages: int


class GenreCreateRequest(GenreBase):
    pass


class GenreCreate(GenreBase):
    user_id: int


class GenreUpdate(GenreBase):
    pass
