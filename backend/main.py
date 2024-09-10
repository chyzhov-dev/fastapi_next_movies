from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from movie.router import router as movie_router
from genre.router import router as genre_router
from auth.router import router as auth_router

from database import Base, engine

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router, prefix="/api/auth", tags=["auth-api"])
app.include_router(genre_router, prefix="/api/genres", tags=["genres-api"])
app.include_router(movie_router, prefix="/api/movies", tags=["movies-api"])
