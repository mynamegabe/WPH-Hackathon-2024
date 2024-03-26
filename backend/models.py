from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, TEXT
from sqlalchemy.orm import relationship
from sqlalchemy.orm import backref

from utils.db import Base

class Field(Base):
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True)
    form_id = Column(Integer, ForeignKey("forms.id"))
    name = Column(String(50), default="")
    description = Column(TEXT, default="")
    required = Column(Boolean, default=False)

    form = relationship("Form", back_populates="fields")
    responses = relationship("Response", back_populates="field")


class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    description = Column(TEXT)
    conversational = Column(Boolean, default=False)
    max_responses = Column(Integer, default=3)

    fields = relationship("Field", back_populates="form")
    responses = relationship("Response", back_populates="form")


class FormResponse(Base):
    __tablename__ = "form_responses"

    id = Column(Integer, primary_key=True)
    remark = Column(TEXT, default="")
    form_id = Column(Integer, ForeignKey("forms.id"))
    response_id = Column(Integer, ForeignKey("responses.id"))

    form = relationship("Form", backref=backref("form_responses", cascade="all, delete-orphan"))
    response = relationship("Response", backref=backref("form_responses", cascade="all, delete-orphan"))


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True)
    response_id = Column(String(64))
    user_id = Column(Integer, ForeignKey("users.id"))
    form_id = Column(Integer, ForeignKey("forms.id"))
    field_id = Column(Integer, ForeignKey("fields.id"))
    ai_detected = Column(Boolean, default=False)
    response = Column(TEXT)

    user = relationship("User", back_populates="responses")
    form = relationship("Form", back_populates="responses")
    field = relationship("Field", back_populates="responses")


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    description = Column(TEXT)
    salary_range = Column(String(128))
    openings = Column(Integer)
    location = Column(String(128))
    traits = Column(String(256))
    icon = Column(String(256), default="Calendar")

    user_roles = relationship("UserRole", back_populates="role")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    image = Column(String(256), default="https://media.istockphoto.com/id/1441360103/photo/close-up-portrait-of-awesome-young-caucasian-male-smiling-and-looking-at-camera-at-the.webp?b=1&s=170667a&w=0&k=20&c=d8LX9wb13x8pRm-vLkOrEDiagsjSFNoIgr-eAUeIqyI=")
    email = Column(String(128), unique=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    phone_number = Column(String(50))
    age = Column(Integer)
    hashed_password = Column(String(128))
    role = Column(String(50), default="user") # administrator, user, applicant
    traits = Column(String(256), default="")
    description = Column(TEXT, default="")
    resume = Column(String(256), default="")

    user_roles = relationship("UserRole", back_populates="user")
    responses = relationship("Response", back_populates="user")


class UserRole(Base):
    __tablename__ = "user_roles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role_id = Column(Integer, ForeignKey("roles.id"))
    status = Column(String(50), default="pending")
    remarks = Column(TEXT, default="")

    user = relationship("User", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles")