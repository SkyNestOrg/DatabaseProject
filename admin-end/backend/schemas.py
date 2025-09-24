# backend/schemas.py
from pydantic import BaseModel

class StaffCreate(BaseModel):
    username: str
    password: str
    official_role: str
    branch_id: int

class StaffOut(BaseModel):
    username: str
    official_role: str
    branch_id: int

    class Config:
        orm_mode = True

class BranchOut(BaseModel):
    branch_id: int
    branch_name: str

    class Config:
        orm_mode = True

class StaffWithBranch(BaseModel):
    username: str
    official_role: str
    branch_id: int
    branch_name: str | None

    class Config:
        orm_mode = True