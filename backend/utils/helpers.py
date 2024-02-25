import string
import random

import utils.gemini as gemini
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
            ai_detected = gemini.detectAIContent(field['value'])
            db_response = models.Response(response_id=response_id, user_id=user.id, form_id=form.id, field_id=field['id'], response=field['value'], ai_detected=ai_detected)
            user.responses.append(db_response)
            form.responses.append(db_response)
            db.add(db_response)
        db.commit()
    return True