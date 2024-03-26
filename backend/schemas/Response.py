from pydantic import BaseModel

class Response(BaseModel):
    fields: list[dict]

class ConversationResponse(BaseModel):
    question: str
    reply: str
    
class Conversation(BaseModel):
    fields: list[dict]