from auth.auth_service import get_principal
from genre.repository import GenreRepository, get_genre_repository
from fastapi import Depends


def get_genre_id(genre_id: int):
    return genre_id


def is_genre_creator(
    principal=Depends(get_principal),
    genre_id: int = Depends(get_genre_id),
    genre_repository: GenreRepository = Depends(get_genre_repository),
) -> bool:
    if not principal:
        return False

    genre = genre_repository.get_by_id(genre_id)
    if not genre:
        return False

    return bool(genre.user_id == principal.id)
