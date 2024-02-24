from pydantic import BaseModel

class Response(BaseModel):
    fields: list[dict]
