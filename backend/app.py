from fastapi import Depends, FastAPI, HTTPException, Request, Response, BackgroundTasks, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
from contextlib import asynccontextmanager
import hashlib
import uvicorn
import json

# import controllers, models, schemas
import controllers.User as UserControllers
import schemas.User as UserSchemas
import schemas.Role as RoleSchemas
import schemas.Response as ResponseSchemas
import schemas.Form as FormSchema
import schemas.Others as OthersSchema
import models
from utils.db import Session as SessionLocal, Base, engine, get_db
from utils.auth import authorize_user
from utils.helpers import checkFormResponse, checkResume
import utils.gemini as gemini
import utils.mailer as mailer
from utils.video.eyes import checkEyes
from utils.generate_report import PdfCreator
from utils import config


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    # create admin user
    db = SessionLocal()
    db_user = UserControllers.get_user_by_email(db, email="admin@gmail.com")
    if db_user is None:
        admin = UserSchemas.UserCreate(email="admin@gmail.com", password="admin",
                                       first_name="Admin", last_name="Admin", phone_number="1234567890", age=25)
        UserControllers.create_user(db=db, user=admin)
        db.commit()

    # create project manager role
    db_role = db.query(models.Role).filter(
        models.Role.name == "Project Manager").first()
    if db_role is None:
        role = models.Role(name="Project Manager", description="Responsible for planning, executing, and closing projects.",
                           salary_range="$100,000-$130,000", openings=5, location="Physical", traits="Leadership, Communication, Time Management")
        db.add(role)
        db.commit()

    # create a form about interpersonal skills
    db_form = db.query(models.Form).filter(
        models.Form.name == "Interpersonal Skills").first()
    if db_form is None:
        form = models.Form(name="Interpersonal Skills",
                           description="This form is about interpersonal skills.")
        db.add(form)
        db.commit()
        fields = [
            models.Field(form_id=form.id, name="Communication",
                         description="How well do you communicate?", required=True),
            models.Field(form_id=form.id, name="Teamwork",
                         description="How well do you work in a team?", required=True),
            models.Field(form_id=form.id, name="Leadership",
                         description="How well do you lead a team?", required=True),
            models.Field(form_id=form.id, name="Problem Solving",
                         description="How well do you solve problems?", required=True)
        ]
        db.add_all(fields)
        db.commit()
    db.close()
    yield


middleware = [Middleware(
    SessionMiddleware, secret_key=config.SECRET_KEY, same_site="none", https_only=True)]
app = FastAPI(middleware=middleware, lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")

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


@app.get("/profile/resume")
def get_resume(db: Session = Depends(get_db), email: str = Depends(authorize_user)):
    user = UserControllers.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    filepath = Path("uploads", "resumes", user.resume)
    filename = f"{user.first_name}_{user.last_name}_resume.pdf"
    return FileResponse(filepath, media_type="application/pdf", filename=user.resume)


@app.get("/user/{user_id}/resume")
def get_user_resume(user_id: int, db: Session = Depends(get_db)):
    user = UserControllers.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    filepath = Path("uploads", "resumes", user.resume)
    filename = f"{user.first_name}_{user.last_name}_resume.pdf"
    return FileResponse(filepath, media_type="application/pdf", filename=user.resume)


@app.post("/upload/resume")
def upload_resume(background_tasks: BackgroundTasks, resume: UploadFile = File(...), db: Session = Depends(get_db), email: str = Depends(authorize_user)):
    user = UserControllers.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    contents = resume.file.read()
    filename = f"{user.id}.pdf"
    filepath = Path("uploads", "resumes", filename)
    with open(filepath, "wb") as f:
        f.write(contents)
    user.resume = filename
    db.commit()
    background_tasks.add_task(
        checkResume,
        filepath, email
    )
    return {"message": "Resume uploaded successfully"}


@app.get("/users/")
def get_users(db: Session = Depends(get_db)):
    users = UserControllers.get_users_by_role(db, role="user")
    matched_roles = db.query(models.Role.name, models.MatchUserRole.user_id, models.Role.id).join(models.MatchUserRole).filter(models.Role.id == models.MatchUserRole.role_id).all()
    matched_roles = [dict(zip(["role", "user_id", "role_id"], row))
                     for row in matched_roles]
    return {
        "users": users,
        "matched_roles": matched_roles
    }


@app.get("/users/{user_id}", response_model=UserSchemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return UserControllers.get_user(db, user_id=user_id)


@app.post("/form/send")
def assign_form(data: FormSchema.FormAssign, db: Session = Depends(get_db)):
    user = UserControllers.get_user(db, user_id=data.user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    form = db.query(models.Form).filter(models.Form.id == data.form_id).first()
    if form is None:
        raise HTTPException(status_code=404, detail="Form not found")
    form_url = f"{config.FRONTEND_URL}/form/{data.form_id}?email={user.email}"
    mailer.sendEmail("Form Assignment", config.SENDGRID_TEMPLATES["FORM"], config.FROM_EMAIL, user.email, {
                     "company_name": config.COMPANY_NAME})
    return {
        "message": "Form assigned successfully"
    }


@app.get("/role/{role_id}", response_model=RoleSchemas.Role)
def get_role(role_id, db: Session = Depends(get_db)):
    return db.query(models.Role).filter(models.Role.id == role_id).first()


@app.get("/roles", response_model=list[RoleSchemas.Role])
def get_roles(db: Session = Depends(get_db)):
    return db.query(models.Role).all()


@app.post("/roles")
def create_role(role: RoleSchemas.RoleCreate, db: Session = Depends(get_db)):
    db_role = models.Role(name=role.name, description=role.description, salary_range=role.salary_range,
                          openings=role.openings, location=role.location, traits=role.traits)
    db.add(db_role)
    db.commit()
    return {
        "status": "success",
        "message": "Role created successfully"
    }


@app.post("/role/{role_id}/apply")
def apply_role(role_id: int, db: Session = Depends(get_db), email: str = Depends(authorize_user)):
    role = db.query(models.Role).filter(models.Role.id == role_id).first()
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    user = UserControllers.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_role = models.UserRole(user_id=user.id, role_id=role.id)
    db.add(user_role)
    db.commit()
    return {
        "message": "Application submitted successfully"
    }


@app.get("/role/{role_id}/applicants")
def get_applicants(role_id: int, db: Session = Depends(get_db)):
    users = db.query(models.User).join(models.UserRole).filter(
        models.UserRole.role_id == role_id).all()
    # SELECT jobstop.roles.name, jobstop.match_user_roles.user_id FROM jobstop.match_user_roles JOIN jobstop.roles ON match_user_roles.role_id = roles.id
    matched_roles = db.query(models.Role.name, models.MatchUserRole.user_id, models.Role.id).join(
        models.MatchUserRole).filter(models.Role.id == models.MatchUserRole.role_id).all()
    print(matched_roles)
    matched_roles = [dict(zip(["role", "user_id", "role_id"], row))
                     for row in matched_roles]
    # matched_roles = db.query(models.Role.name, models.MatchUserRole.user_id).join(models.MatchUserRole).filter(models.Role.id == models.MatchUserRole.role_id).all()
    return {
        "applicants": users,
        "matched_roles": matched_roles
    }

@app.post("/user/avatar")
def upload_avatar(avatar: UploadFile = File(...), db: Session = Depends(get_db), email: str = Depends(authorize_user)):
    user = UserControllers.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    contents = avatar.file.read()
    filename = f"{user.id}.png"
    filepath = Path("uploads", "avatars", filename)
    with open(filepath, "wb") as f:
        f.write(contents)
    user.image = filename
    db.commit()
    return {"message": "Avatar uploaded successfully"}


@app.get("/uploads/avatars/{user_id}.png")
def get_avatar(user_id: int, db: Session = Depends(get_db)):
    user = UserControllers.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.image is None:
        raise HTTPException(status_code=404, detail="Avatar not found")
    filepath = Path("uploads", "avatars", user.image)
    return FileResponse(filepath, media_type="image/png", filename=user.image)

@app.post("/user/{user_id}/roles")
def match_roles(user_id: int, db: Session = Depends(get_db)):
    # get roles
    roles = db.query(models.Role).all()
    # get user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    roles = gemini.matchRoles(user, roles)
    # delete all matched roles
    db.query(models.MatchUserRole).filter(
        models.MatchUserRole.user_id == user_id).delete()
    db.commit()
    matches = []
    for role_id in roles:
        user_role = models.MatchUserRole(user_id=user.id, role_id=role_id)
        matches.append(user_role)
    db.add_all(matches)
    db.commit()

    return roles


@app.get("/forms")
def get_forms(db: Session = Depends(get_db)):
    return db.query(models.Form).all()


@app.post("/forms")
def create_form(form: FormSchema.FormCreate, db: Session = Depends(get_db)):
    db_form = models.Form(
        name=form.name, description=form.description, conversational=form.conversational)
    db.add(db_form)
    db.commit()
    fields = []
    for f in form.fields:
        field = models.Field(form_id=db_form.id,
                             description=f["question"], required=1)
        fields.append(field)
    db.add_all(fields)
    db.commit()
    return {
        "status": "success",
    }


@app.get("/forms/{form_id}")
def get_form(form_id: int, db: Session = Depends(get_db)):
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if form is None:
        raise HTTPException(status_code=404, detail="Form not found")
    return {
        "form": form,
        "fields": form.fields,
    }


@app.post("/forms/{form_id}/conversation")
def converse(form_id: int, response: ResponseSchemas.ConversationResponse, db: Session = Depends(get_db), email: str = Depends(authorize_user)):
    chat = gemini.startChatAssessment()
    next_question = gemini.getNextQuestion(
        chat, response.question, response.reply)
    return {"question": next_question}


@app.post("/forms/{form_id}/conversation/submit")
def submit_conversation(background_tasks: BackgroundTasks, form_id: int, response: ResponseSchemas.Conversation, db: Session = Depends(get_db), email: str = Depends(authorize_user)):
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if form is None:
        raise HTTPException(status_code=404, detail="Form not found")

    # get first field
    field = db.query(models.Field).filter(
        models.Field.form_id == form_id).first()
    if field is None:
        raise HTTPException(status_code=404, detail="Field not found")

    responses = db.query(models.Response).join(models.User).filter(
        models.Response.form_id == form_id, models.User.email == email).all()
    if responses:
        for r in responses:
            db.delete(r)
        db.commit()

    # create new response
    user = UserControllers.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    response = models.Response(user_id=user.id, form_id=form.id,
                               field_id=field.id, response=json.dumps(response.fields))
    db.add(response)
    db.commit()

    return {
        "message": "Response submitted successfully"
    }


@app.post("/forms/{form_id}/submit")
def submit_form(background_tasks: BackgroundTasks, form_id: int, response: ResponseSchemas.Response, db: Session = Depends(get_db), email: str = Depends(authorize_user)):
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if form is None:
        raise HTTPException(status_code=404, detail="Form not found")
    # check if user has already submitted the form
    responses = db.query(models.Response).join(models.User).filter(
        models.Response.form_id == form_id, models.User.email == email).all()
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
    users = db.query(models.User).join(models.Response).filter(
        models.Response.form_id == form_id).all()
    return users


@app.get("/forms/{form_id}/responses/{user_id}")
def get_user_responses(form_id: int, user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    responses = db.query(models.Response).filter(
        models.Response.form_id == form_id, models.Response.user_id == user_id).all()
    return responses


@app.post("/video/detect")
def detect_video(background_tasks: BackgroundTasks, video: UploadFile = File(...), db: Session = Depends(get_db), email: str = Depends(authorize_user)):
    contents = video.file.read()
    filename = f"1.mp4"
    filepath = Path("uploads", "videos", filename)
    with open(filepath, "wb") as f:
        f.write(contents)
    background_tasks.add_task(
        checkEyes,
        str(filepath)
    )
    return {"message": "Video uploaded successfully"}


@app.get("/user/{user_id}/report")
def generate_report(user_id: int, db: Session = Depends(get_db)):
    user = UserControllers.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    responses = db.query(models.Response).filter(models.Response.user_id == user_id).all()
    forms = {}
    for response in responses:
        form = db.query(models.Form).filter(models.Form.id == response.form_id).first()
        if form is None:
            continue
        if form.name not in forms:
            forms[form.name] = []
        # get field description
        field = db.query(models.Field).filter(models.Field.id == response.field_id).first()
        
        forms[form.name].append(
            {
                "question": field.description,
                "response": response.response
            }
            )
    
    pdf_creator = PdfCreator()
    pdf_value = pdf_creator.build_pdf(
        image=f"uploads/avatars/{user.image}",
        name=f"{user.first_name} {user.last_name}",
        description=user.description,
        traits=user.traits,
        age=user.age,
        phone_number=user.phone_number,
        email=user.email,
        forms=forms
    )
    with open(f"{user.id}.pdf", "wb") as pdf_file:
        pdf_file.write(pdf_value)
        
    return FileResponse(f"{user.id}.pdf", media_type="application/pdf", filename=f"{user.first_name}_{user.last_name}_report.pdf")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
