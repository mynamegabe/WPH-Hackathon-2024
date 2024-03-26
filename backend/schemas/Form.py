from pydantic import BaseModel

class Form(BaseModel):
    name: str
    description: str
    fields: list[dict] = [] # list of fields
    conversational: bool = False
    
class FormCreate(Form):
    pass