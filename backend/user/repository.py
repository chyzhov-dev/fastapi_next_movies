from fastapi import Depends
from sqlalchemy.orm import Session

from database import get_db

from user.model import User
from auth.schema import UserRegister


class UserRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_id(self, user_id: int):
        return self.session.query(User).filter(User.id == user_id).first()

    def get_by_email(self, user_email: str):
        return self.session.query(User).filter(User.email == user_email).first()

    def create(self, entity: UserRegister):
        db_user = User(**entity.model_dump())

        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)

        return db_user


def get_user_repository(db: Session = Depends(get_db)):
    return UserRepository(db)
