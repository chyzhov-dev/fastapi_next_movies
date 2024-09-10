import config
import requests
from http import HTTPStatus
from fastapi import HTTPException
from urllib.parse import urlencode
from random import SystemRandom
from oauthlib.common import UNICODE_ASCII_CHARACTER_SET


class GoogleAuthService:
    CLIENT_ID = config.GOOGLE_CLIENT_ID
    CLIENT_SECRET = config.GOOGLE_CLIENT_SECRET
    LOGIN_REDIRECT_URL = config.GOOGLE_LOGIN_CALLBACK_URL

    SCOPES = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
    ]

    GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth"
    GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token"
    GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

    @staticmethod
    def generate_state_session_token(length=30, chars=UNICODE_ASCII_CHARACTER_SET):
        rand = SystemRandom()
        state = "".join(rand.choice(chars) for _ in range(length))
        return state

    def get_authorization_url(self):
        state = self.generate_state_session_token()

        print(self.LOGIN_REDIRECT_URL)

        params = {
            "response_type": "code",
            "client_id": self.CLIENT_ID,
            "redirect_uri": self.LOGIN_REDIRECT_URL,
            "scope": " ".join(self.SCOPES),
            "state": state,
            "access_type": "offline",
            "include_granted_scopes": "true",
            "prompt": "select_account",
        }

        query_params = urlencode(params)
        authorization_url = f"{self.GOOGLE_AUTH_URL}?{query_params}"

        return authorization_url, state

    def get_tokens(self, *, code: str):
        data = {
            "code": code,
            "client_id": self.CLIENT_ID,
            "client_secret": self.CLIENT_SECRET,
            "redirect_uri": self.LOGIN_REDIRECT_URL,
            "grant_type": "authorization_code",
        }

        response = requests.post(
            self.GOOGLE_ACCESS_TOKEN_OBTAIN_URL,
            data=data
        )

        if not response.ok:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail="Failed to obtain user info from Google."
            )

        tokens = response.json()

        return (
            tokens["id_token"],
            tokens["access_token"]
        )

    def get_user_info(self, access_token: str):
        response = requests.get(
            self.GOOGLE_USER_INFO_URL,
            params={"access_token": access_token}
        )

        if not response.ok:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail="Failed to obtain user info from Google."
            )

        return response.json()


def get_google_auth_service():
    return GoogleAuthService()
