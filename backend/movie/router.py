from http import HTTPStatus
from fastapi import APIRouter, Depends, Query
from movie.schema import (
    MovieCreateRequest,
    MovieRead, MovieUpdate,
    MovieCreate, MoviePage
)
from movie.service import MovieService, get_movie_service
from common.schema import ApiResponse
from user.schema import UserRead
from util.decorators import with_api_exception_handling
from auth.guard import with_auth
from movie.predicates import is_movie_creator
from movie.const import DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER

router = APIRouter()


@router.get("/", response_model=ApiResponse[MoviePage])
@with_api_exception_handling
def fetch(
    search_field: str = Query(default=None),
    search_query: str = Query(default=None),
    sort_by: str = Query(default=None),
    sort_direction: str = Query(default="asc"),
    page: int = Query(default=DEFAULT_PAGE_NUMBER),
    page_size: int = Query(default=DEFAULT_PAGE_SIZE),
    movie_service: MovieService = Depends(get_movie_service),
    principal: UserRead = Depends(with_auth())
):
    data = movie_service.fetch(
        search_field=search_field,
        search_query=search_query,
        sort_by=sort_by,
        sort_direction=sort_direction,
        page_size=page_size,
        page=page,
        user_id=principal.id
    )
    return ApiResponse(status=HTTPStatus.OK, data=data)


@router.get("/{movie_id}", response_model=ApiResponse[MovieRead])
@with_api_exception_handling
def get_by_id(
    movie_id: int,
    movie_service: MovieService = Depends(get_movie_service),
    _=Depends(with_auth(predicate=is_movie_creator))
):
    data = movie_service.get_by_id(movie_id)
    return ApiResponse(status=HTTPStatus.OK, data=data)


@router.post("/", response_model=ApiResponse[MovieRead])
@with_api_exception_handling
def create(
    entity: MovieCreateRequest,
    movie_service: MovieService = Depends(get_movie_service),
    principal: UserRead = Depends(with_auth())
):
    data = MovieCreate(
        user_id=principal.id,
        name=entity.name,
        description=entity.description,
        release_year=entity.release_year,
        genre_ids=entity.genre_ids
    )
    return ApiResponse(status=HTTPStatus.OK, data=movie_service.create(data))


@router.put("/{movie_id}", response_model=ApiResponse[MovieRead])
@with_api_exception_handling
def update(
    movie_id: int,
    entity: MovieUpdate,
    movie_service: MovieService = Depends(get_movie_service),
    _=Depends(with_auth(predicate=is_movie_creator))
):
    data = MovieUpdate(
        name=entity.name,
        description=entity.description,
        release_year=entity.release_year,
        genre_ids=entity.genre_ids
    )
    return ApiResponse(
        status=HTTPStatus.OK,
        data=movie_service.replacement_update(movie_id, data)
    )


@router.patch("/{movie_id}", response_model=ApiResponse[MovieRead])
@with_api_exception_handling
def patch_update(
    movie_id: int,
    entity: MovieUpdate,
    movie_service: MovieService = Depends(get_movie_service),
    _=Depends(with_auth(predicate=is_movie_creator))
):
    data = MovieUpdate(
        name=entity.name,
        description=entity.description,
        release_year=entity.release_year,
        genre_ids=entity.genre_ids
    )
    return ApiResponse(
        status=HTTPStatus.OK,
        data=movie_service.patch_update(movie_id, data)
    )


@router.delete("/{movie_id}", response_model=ApiResponse[MovieRead])
@with_api_exception_handling
def delete(
    movie_id: int,
    movie_service: MovieService = Depends(get_movie_service),
    _=Depends(with_auth(predicate=is_movie_creator))
):
    return ApiResponse(
        status=HTTPStatus.OK,
        data=movie_service.delete(movie_id)
    )
