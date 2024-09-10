from http import HTTPStatus
from fastapi import Depends, HTTPException
from typing import Optional
from movie.repository import MovieRepository, get_movie_repository
from movie.schema import (
    MovieCreate, MovieUpdate, MovieRead, MoviePage
)
from util.decorators import with_error_logger


class MovieService:
    def __init__(
        self,
        repo: MovieRepository = Depends(get_movie_repository)
    ):
        self.movie_repository = repo

    @with_error_logger
    def get_by_id(self, movie_id: int):
        db_movie = self.movie_repository.get_by_id(movie_id)

        if db_movie is None:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND,
                                detail=f"Movie with id: {movie_id} not found")

        return MovieRead.model_validate(db_movie)

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
        items, total_pages, current_page = self.movie_repository.get_many(
            search_field=search_field,
            search_query=search_query,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_direction=sort_direction,
            user_id=user_id
        )

        page_data = {
            "items": items,
            "total_pages": total_pages,
            "current_page": current_page
        }

        return MoviePage.model_validate(page_data)

    @with_error_logger
    def create(self, entity: MovieCreate):
        db_movie = self.movie_repository.create(entity)
        return MovieRead.model_validate(db_movie)

    @with_error_logger
    def replacement_update(
        self,
        movie_id: int,
        movie_update: MovieUpdate
    ):
        db_movie = self.movie_repository.update(movie_id, movie_update)

        if db_movie is None:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND,
                                detail=f"Movie with id: {movie_id} not found")

        return MovieRead.model_validate(db_movie)

    @with_error_logger
    def patch_update(self,
                     movie_id: int,
                     movie_update: MovieUpdate):
        db_movie = self.movie_repository.get_by_id(movie_id)

        if db_movie is None:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND,
                                detail=f"Movie with id: {movie_id} not found")

        for field, value in movie_update.model_dump(exclude_unset=True).items():
            setattr(db_movie, field, value)

        db_movie = self.movie_repository.update(movie_id, db_movie)

        return MovieRead.model_validate(db_movie)

    @with_error_logger
    def delete(self, item_id: int):
        db_movie = self.movie_repository.delete(item_id)
        return MovieRead.model_validate(db_movie)


def get_movie_service(repo: MovieRepository = Depends(get_movie_repository)):
    return MovieService(repo)
