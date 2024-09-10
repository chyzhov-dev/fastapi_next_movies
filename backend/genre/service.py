from http import HTTPStatus
from fastapi import Depends, HTTPException
from typing import Optional
from genre.repository import GenreRepository, get_genre_repository
from genre.schema import (
    GenreCreate, GenreUpdate, GenreRead, GenrePage
)
from util.decorators import with_error_logger


class GenreService:
    def __init__(
        self,
        repo: GenreRepository = Depends(get_genre_repository)
    ):
        self.genre_repository = repo

    @with_error_logger
    def get_by_id(self, genre_id: int):
        db_genre = self.genre_repository.get_by_id(genre_id)

        if db_genre is None:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND,
                                detail=f"Genre with id: {genre_id} not found")

        return GenreRead.model_validate(db_genre)

    @with_error_logger
    def fetch(
        self,
        user_id: int,
        page: Optional[int] = None,
        page_size: Optional[int] = None,
        search_field: Optional[str] = None,
        search_query: Optional[str] = None,
        sort_by: Optional[str] = None,
        sort_direction: Optional[str] = None
    ):
        items, total_pages, current_page = self.genre_repository.get_many(
            search_field=search_field,
            search_query=search_query,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_direction=sort_direction,
            user_id=user_id
        )

        pagea = {
            "items": items,
            "total_pages": total_pages,
            "current_page": current_page
        }
        print(pagea)

        return GenrePage.model_validate(pagea)

    @with_error_logger
    def create(self, entity: GenreCreate):
        db_genre = self.genre_repository.create(entity)
        return GenreRead.model_validate(db_genre)

    @with_error_logger
    def replacement_update(
        self,
        genre_id: int,
        genre_update: GenreUpdate
    ):
        db_genre = self.genre_repository.update(genre_id, genre_update)

        if db_genre is None:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND,
                                detail=f"Genre with id: {genre_id} not found")

        return GenreRead.model_validate(db_genre)

    @with_error_logger
    def patch_update(self,
                     genre_id: int,
                     genre_update: GenreUpdate):
        db_genre = self.genre_repository.get_by_id(genre_id)

        if db_genre is None:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND,
                                detail=f"Genre with id: {genre_id} not found")

        for field, value in genre_update.model_dump(exclude_unset=True).items():
            setattr(db_genre, field, value)

        db_genre = self.genre_repository.update(genre_id, db_genre)

        return GenreRead.model_validate(db_genre)

    @with_error_logger
    def delete(self, item_id: int):
        db_genre = self.genre_repository.delete(item_id)
        return GenreRead.model_validate(db_genre)


def get_genre_service(repo: GenreRepository = Depends(get_genre_repository)):
    return GenreService(repo)
