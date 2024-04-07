from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: str
    phone_number: str
    age: int


class UserCreate(UserBase):
    description: Optional[str] = ""
    role: Optional[str] = "user"
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserDescription(BaseModel):
    description: str

class User(UserBase):
    id: int
    image: str | None
    description: str | None
    resume: str | None
    traits: str | None

    class Config:
        from_attributes = True