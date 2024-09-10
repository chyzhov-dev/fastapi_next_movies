from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base
from genre.model import movie_genre_association


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)

    name = Column(String, index=True)
    description = Column(String, index=True)
    release_year = Column(Integer, index=True)

    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", backref="movies")

    genres = relationship(
        "Genre",
        secondary=movie_genre_association,
        back_populates="movies"
    )
