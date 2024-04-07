import string
import random

import utils.gemini as gemini
import utils.detection as detection
import utils.pdf as pdf
from utils.video.eyes import checkEyes
from utils.db import Session
import models


def generateId(length=64):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


def checkFormResponse(response, email, form_id):
    with Session() as db:
        response_id = generateId()
        form = db.query(models.Form).filter(models.Form.id == form_id).first()
        user = db.query(models.User).filter(models.User.email == email).first()
        for field in response.fields:
            # ai_detected = gemini.detectAIContent(field['value'])
            ai_detected = detection.detectAIContent(field['value'])
            db_response = models.Response(response_id=response_id, user_id=user.id, form_id=form.id, field_id=field['id'], response=field['value'], ai_detected=ai_detected)
            user.responses.append(db_response)
            form.responses.append(db_response)
            db.add(db_response)
        db.commit()
    return True


def checkResume(filepath: str, email: str):
    text = pdf.read_pdf(filepath)
    traits = gemini.extractTraits(text)
    print(traits)
    with Session() as db:
        user = db.query(models.User).filter(models.User.email == email).first()
        user.traits = traits
        db.commit()
    

def doCheckEyes(filepath: str, user_id: int, filename: str):
    left, right = checkEyes(filepath)
    with Session() as db:
        user_video = models.UserVideos(user_id=user_id, left=left, right=right, filename=filename)
        db.add(user_video)
        db.commit()
    return True
