from pydantic import BaseModel

class RoleBase(BaseModel):
    name: str
    description: str
    salary_range: str
    openings: int
    location: str
    traits: str

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    icon: str | None
    

    class Config:
        from_attributes = True