from typing import List

from pydantic import Field

from common.schema import TimestampMixin, OrmBase
from genre.schema import GenreReadBase
from user.schema import UserRead


class MovieBase(OrmBase):
    name: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1, max_length=1023)
    release_year: int = Field(gt=1900, lt=2100)


class MovieReadBase(MovieBase, TimestampMixin):
    id: int
    user: UserRead


class MovieRead(MovieReadBase):
    genres: List[GenreReadBase]


class MovieList(OrmBase):
    items: List[MovieRead]


class MoviePage(MovieList):
    current_page: int
    total_pages: int


class MovieCreateRequest(MovieBase):
    genre_ids: List[int]


class MovieUpdate(MovieBase):
    genre_ids: List[int]


class MovieCreate(MovieUpdate):
    user_id: int
