from pydantic import BaseModel


class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: str
    phone_number: str
    age: int


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class User(UserBase):
    id: int
    image: str | None
    description: str | None
    resume: str | None
    traits: str | None

    class Config:
        from_attributes = True