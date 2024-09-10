import os
from dotenv import load_dotenv

load_dotenv()


BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL")
if not BACKEND_BASE_URL:
    raise Exception("BACKEND_BASE_URL is not set")

FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL")
if not FRONTEND_BASE_URL:
    raise Exception("FRONTEND_BASE_URL is not set")

GOOGLE_LOGIN_CALLBACK_URL = BACKEND_BASE_URL + "/api/auth/callback/google"

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
if not GOOGLE_CLIENT_ID:
    raise Exception("GOOGLE_CLIENT_ID is not set")

GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
if not GOOGLE_CLIENT_SECRET:
    raise Exception("GOOGLE_CLIENT_SECRET is not set")

ALGORITHM = os.getenv("ALGORITHM")
if not ALGORITHM:
    raise Exception("ALGORITHM is not set")

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise Exception("SECRET_KEY is not set")

ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
if not ACCESS_TOKEN_EXPIRE_MINUTES:
    raise Exception("ACCESS_TOKEN_EXPIRE_MINUTES is not set")
ACCESS_TOKEN_EXPIRE_MINUTES = int(ACCESS_TOKEN_EXPIRE_MINUTES)

SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    raise Exception("SQLALCHEMY_DATABASE_URL is not set")
