from math import ceil

from sqlalchemy import desc, asc
from typing import Optional, Any

from sqlalchemy.sql.base import ExecutableOption

from movie.const import DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE


def paginate(
    query,
    page: Optional[int],
    page_size: Optional[int]
):
    if not page:
        page = DEFAULT_PAGE_NUMBER

    if not page_size:
        page_size = DEFAULT_PAGE_SIZE

    total_items = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return items, total_items


def search_and_sort(
    db,
    model,
    page: Optional[int] = None,
    page_size: Optional[int] = None,
    sort_by: Optional[str] = None,
    sort_direction: Optional[str] = "asc",
    search_field: Optional[str] = None,
    search_query: Optional[str] = None,
    criterion: Optional[Any] = None,
    options: Optional[ExecutableOption] = None
):
    query = db.query(model)
    query = query.options(options) if options else query

    if search_query and search_field and hasattr(model, search_field):
        field = getattr(model, search_field)
        field_type = field.type.python_type

        if issubclass(field_type, str):
            search_filter = getattr(model, search_field).contains(search_query)
        elif issubclass(field_type, int):
            search_filter = getattr(model, search_field) == int(search_query)
        else:
            raise ValueError(
                f"Unsupported data type for search field: {field_type}")

        query = query.filter(search_filter)

    if criterion is not None:
        query = query.filter(criterion)

    if sort_by:
        if hasattr(model, sort_by):
            query = query.order_by(
                desc(getattr(model, sort_by))
                if sort_direction == 'desc'
                else asc(getattr(model, sort_by))
            )
        else:
            raise ValueError(f"Invalid sort field: {sort_by}")

    items, total_items = paginate(query, page=page, page_size=page_size)

    return items, ceil(total_items / page_size), page
