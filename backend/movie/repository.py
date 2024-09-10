from fastapi import Depends
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy.orm import joinedload

from database import get_db
from user.model import User
from util.filtering import search_and_sort

from movie.model import Movie
from movie.schema import MovieCreate, MovieUpdate

from genre.model import Genre


class MovieRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_id(self, movie_id: int):
        return (self.session.query(Movie)
                .filter(Movie.id == movie_id)
                .outerjoin(User, User.id == Movie.user_id)
                .options(joinedload(Movie.genres))
                .first())

    def get_many(
        self,
        user_id: int,
        search_field: Optional[str] = None,
        search_query: Optional[str] = None,
        page: Optional[int] = None,
        page_size: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_direction: Optional[str] = None
    ):
        return search_and_sort(
            db=self.session,
            model=Movie,
            search_field=search_field,
            search_query=search_query,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_direction=sort_direction,
            criterion=(Movie.user_id == user_id),
            options=joinedload(Movie.genres)
        )

    def create(self, entity: MovieCreate):
        db_movie = Movie(**entity.model_dump(exclude={"genre_ids"}))

        db_genres = (self.session
                     .query(Genre)
                     .filter(Genre.id.in_(entity.genre_ids))
                     .filter(Genre.user_id == entity.user_id)
                     .all())

        db_movie.genres = db_genres

        self.session.add(db_movie)
        self.session.commit()
        self.session.refresh(db_movie)

        return db_movie

    def update(
        self,
        movie_id: int,
        movie_update: MovieUpdate
    ):
        db_movie = self.get_by_id(movie_id)

        if not db_movie:
            return None

        for var, value in vars(movie_update).items():
            setattr(db_movie, var, value)

        if movie_update.genre_ids is not None:
            db_genres = (self.session
                         .query(Genre)
                         .filter(Genre.id.in_(movie_update.genre_ids))
                         .filter(Genre.user_id == db_movie.user_id)
                         .all())
            db_movie.genres = db_genres

        self.session.commit()
        self.session.refresh(db_movie)

        return self.get_by_id(movie_id)

    def delete(self, item_id: int):
        db_movie = self.get_by_id(item_id)

        if not db_movie:
            return None

        self.session.delete(db_movie)
        self.session.commit()

        return db_movie


def get_movie_repository(db: Session = Depends(get_db)):
    return MovieRepository(db)
