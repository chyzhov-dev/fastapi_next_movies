from auth.auth_service import get_principal
from movie.repository import MovieRepository, get_movie_repository
from fastapi import Depends


def get_movie_id(movie_id: int):
    return movie_id


def is_movie_creator(
    principal=Depends(get_principal),
    movie_id: int = Depends(get_movie_id),
    movie_repository: MovieRepository = Depends(get_movie_repository),
) -> bool:
    if not principal:
        return False

    movie = movie_repository.get_by_id(movie_id)
    if not movie:
        return False

    return bool(movie.user_id == principal.id)
