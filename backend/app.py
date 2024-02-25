from fastapi import Depends, FastAPI, HTTPException, Request, Response, BackgroundTasks
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import hashlib
import uvicorn

# import controllers, models, schemas
import controllers.User as UserControllers
import schemas.User as UserSchemas
import schemas.Role as RoleSchemas
import schemas.Response as ResponseSchemas
import models
from utils.db import Session as SessionLocal, Base, engine, get_db
from utils.auth import authorize_user
from utils.helpers import generateId, checkFormResponse
import utils.gemini as gemini
from utils import config


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    
    # create admin user
    db = SessionLocal()
    db_user = UserControllers.get_user_by_email(db, email="admin@gmail.com")
    if db_user is None:
        admin = UserSchemas.UserCreate(email="admin@gmail.com", password="admin", first_name="Admin", last_name="Admin", phone_number="1234567890", age=25)
        UserControllers.create_user(db=db, user=admin)
        db.commit()

    # create project manager role
    db_role = db.query(models.Role).filter(models.Role.name == "Project Manager").first()
    if db_role is None:
        role = models.Role(name="Project Manager", description="Responsible for planning, executing, and closing projects.", salary_range="$100,000-$130,000", openings=5, location="Physical", traits="Leadership, Communication, Time Management")
        db.add(role)
        db.commit()

    # create a form about interpersonal skills
    db_form = db.query(models.Form).filter(models.Form.name == "Interpersonal Skills").first()
    if db_form is None:
        form = models.Form(name="Interpersonal Skills", description="This form is about interpersonal skills.")
        db.add(form)
        db.commit()
        fields = [
            models.Field(form_id=form.id, name="Communication", description="How well do you communicate?", required=True),
            models.Field(form_id=form.id, name="Teamwork", description="How well do you work in a team?", required=True),
            models.Field(form_id=form.id, name="Leadership", description="How well do you lead a team?", required=True),
            models.Field(form_id=form.id, name="Problem Solving", description="How well do you solve problems?", required=True)
        ]
        db.add_all(fields)
        db.commit()
    db.close()
    yield


middleware = [Middleware(SessionMiddleware, secret_key=config.SECRET_KEY, same_site="none", https_only=True)]
app = FastAPI(middleware=middleware, lifespan=lifespan)

origins = [
    "http://localhost:3000",
    # "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.post("/auth/login")
def login(request: Request, response: Response, user: UserSchemas.UserLogin, db: Session = Depends(get_db)):
    db_user = UserControllers.get_user_by_email(db, email=user.email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    if db_user.hashed_password != hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect password")
    request.session["email"] = db_user.email
    return {"message": "Login successful"}


@app.post("/auth/register")
def create_user(user: UserSchemas.UserCreate, db: Session = Depends(get_db)):
    db_user = UserControllers.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return UserControllers.create_user(db=db, user=user)


@app.get("/auth/me", response_model=UserSchemas.User)
def get_current_user(db: Session = Depends(get_db), email: str = Depends(authorize_user)):
    return UserControllers.get_user_by_email(db, email=email)


@app.get("/applicants/", response_model=list[UserSchemas.User])
def get_users(db: Session = Depends(get_db)):
    users = UserControllers.get_users_by_role(db, role="user")
    return users


@app.get("/users/{user_id}", response_model=UserSchemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return UserControllers.get_user(db, user_id=user_id)


@app.get("/applicants/{user_id}", response_model=UserSchemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return UserControllers.get_user(db, user_id=user_id)


@app.get("/roles", response_model=list[RoleSchemas.Role])
def get_roles(db: Session = Depends(get_db)):
    return db.query(models.Role).all()


@app.get("/forms")
def get_forms(db: Session = Depends(get_db)):
    return db.query(models.Form).all()


@app.get("/forms/{form_id}")
def get_form(form_id: int, db: Session = Depends(get_db)):
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if form is None:
        raise HTTPException(status_code=404, detail="Form not found")
    return {
        "form": form,
        "fields": form.fields
    }


@app.post("/forms/{form_id}/submit")
def submit_form(background_tasks: BackgroundTasks, form_id: int, response: ResponseSchemas.Response, db: Session = Depends(get_db), email: str = Depends(authorize_user)):
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if form is None:
        raise HTTPException(status_code=404, detail="Form not found")
    # check if user has already submitted the form
    responses = db.query(models.Response).join(models.User).filter(models.Response.form_id == form_id, models.User.email == email).all()
    if responses:
        for r in responses:
            db.delete(r)
        db.commit()

    background_tasks.add_task(
        checkFormResponse,
        response, email, form.id
    )


@app.get("/forms/{form_id}/responses")
def get_responses(form_id: int, db: Session = Depends(get_db)):
    users = db.query(models.User).join(models.Response).filter(models.Response.form_id == form_id).all()
    return users



@app.get("/forms/{form_id}/responses/{user_id}")
def get_user_responses(form_id: int, user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    responses = db.query(models.Response).filter(models.Response.form_id == form_id, models.Response.user_id == user_id).all()
    return responses


# @app.post("/users/{user_id}/items/", response_model=schemas.Item)
# def create_item_for_user(
#     user_id: int, item: schemas.ItemCreate, db: Session = Depends(get_db)
# ):
#     return controllers.User.create_user_item(db=db, item=item, user_id=user_id)


# @app.get("/items/", response_model=list[schemas.Item])
# def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     items = controllers.User.get_items(db, skip=skip, limit=limit)
#     return items

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)