from http import HTTPStatus
from fastapi import APIRouter, Depends, Query
from genre.schema import (
    GenreCreateRequest,
    GenreRead, GenreUpdate,
    GenreCreate, GenrePage
)
from genre.service import GenreService, get_genre_service
from common.schema import ApiResponse
from user.schema import UserRead
from util.decorators import with_api_exception_handling
from auth.guard import with_auth
from genre.predicates import is_genre_creator
from genre.const import DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER

router = APIRouter()


@router.get("/", response_model=ApiResponse[GenrePage])
@with_api_exception_handling
def fetch(
    search_field: str = Query(default=None),
    search_query: str = Query(default=None),
    sort_by: str = Query(default=None),
    sort_direction: str = Query(default="asc"),
    page: int = Query(default=DEFAULT_PAGE_NUMBER),
    page_size: int = Query(default=DEFAULT_PAGE_SIZE),
    genre_service: GenreService = Depends(get_genre_service),
    principal: UserRead = Depends(with_auth())
):
    data = genre_service.fetch(
        search_field=search_field,
        search_query=search_query,
        sort_by=sort_by,
        sort_direction=sort_direction,
        page_size=page_size,
        page=page,
        user_id=principal.id
    )
    return ApiResponse(status=HTTPStatus.OK, data=data)


@router.get("/{genre_id}", response_model=ApiResponse[GenreRead])
@with_api_exception_handling
def get_by_id(
    genre_id: int,
    genre_service: GenreService = Depends(get_genre_service),
    _=Depends(with_auth(predicate=is_genre_creator))
):
    data = genre_service.get_by_id(genre_id)
    return ApiResponse(status=HTTPStatus.OK, data=data)


@router.post("/", response_model=ApiResponse[GenreRead])
@with_api_exception_handling
def create(
    entity: GenreCreateRequest,
    genre_service: GenreService = Depends(get_genre_service),
    principal: UserRead = Depends(with_auth())
):
    data = GenreCreate(
        user_id=principal.id,
        name=entity.name,

    )
    return ApiResponse(status=HTTPStatus.OK, data=genre_service.create(data))


@router.put("/{genre_id}", response_model=ApiResponse[GenreRead])
@with_api_exception_handling
def update(
    genre_id: int,
    entity: GenreUpdate,
    genre_service: GenreService = Depends(get_genre_service),
    _=Depends(with_auth(predicate=is_genre_creator))
):
    data = GenreUpdate(
        name=entity.name,

    )
    return ApiResponse(
        status=HTTPStatus.OK,
        data=genre_service.replacement_update(genre_id, data)
    )


@router.patch("/{genre_id}", response_model=ApiResponse[GenreRead])
@with_api_exception_handling
def patch_update(
    genre_id: int,
    entity: GenreUpdate,
    genre_service: GenreService = Depends(get_genre_service),
    _=Depends(with_auth(predicate=is_genre_creator))
):
    data = GenreUpdate(
        name=entity.name,
    )
    return ApiResponse(
        status=HTTPStatus.OK,
        data=genre_service.patch_update(genre_id, data)
    )


@router.delete("/{genre_id}", response_model=ApiResponse[GenreRead])
@with_api_exception_handling
def delete(
    genre_id: int,
    genre_service: GenreService = Depends(get_genre_service),
    _=Depends(with_auth(predicate=is_genre_creator))
):
    return ApiResponse(
        status=HTTPStatus.OK,
        data=genre_service.delete(genre_id)
    )
