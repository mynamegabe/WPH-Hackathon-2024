from pydantic import BaseModel

class UserVideo(BaseModel):
    user_id: int
    video_id: int