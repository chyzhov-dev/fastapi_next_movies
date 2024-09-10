from fastapi import Depends
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from user.model import User
from util.filtering import search_and_sort

from genre.model import Genre
from genre.schema import GenreCreate, GenreUpdate


class GenreRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_id(self, genre_id: int):
        return (self.session.query(Genre)
                .filter(Genre.id == genre_id)
                .outerjoin(User, User.id == Genre.user_id)
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
            model=Genre,
            search_field=search_field,
            search_query=search_query,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_direction=sort_direction,
            criterion=(Genre.user_id == user_id)
        )

    def create(self, entity: GenreCreate):
        db_genre = Genre(**entity.model_dump())

        self.session.add(db_genre)
        self.session.commit()
        self.session.refresh(db_genre)

        return db_genre

    def update(
        self,
        genre_id: int,
        genre_update: GenreUpdate
    ):
        db_genre = self.get_by_id(genre_id)

        if not db_genre:
            return None

        for var, value in vars(genre_update).items():
            setattr(db_genre, var, value)

        self.session.commit()
        self.session.refresh(db_genre)

        return self.get_by_id(genre_id)

    def delete(self, item_id: int):
        db_genre = self.get_by_id(item_id)

        if not db_genre:
            return None

        self.session.delete(db_genre)
        self.session.commit()

        return db_genre


def get_genre_repository(db: Session = Depends(get_db)):
    return GenreRepository(db)
