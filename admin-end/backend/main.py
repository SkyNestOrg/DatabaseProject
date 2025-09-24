# backend/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from passlib.context import CryptContext

import database, models, schemas

# create tables (safe)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SkyNest Staff API")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CORS - allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adjust if your frontend runs elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# existing endpoint: get branches
@app.get("/branches", response_model=List[schemas.BranchOut])
def read_branches(db: Session = Depends(get_db)):
    return db.query(models.Branch).all()

# existing endpoint: create staff
@app.post("/staff", response_model=schemas.StaffOut)
def create_staff(staff: schemas.StaffCreate, db: Session = Depends(get_db)):
    existing = db.query(models.StaffUser).filter(models.StaffUser.username == staff.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_pw = pwd_context.hash(staff.password)
    db_staff = models.StaffUser(
        username=staff.username,
        password=hashed_pw,
        official_role=staff.official_role,
        branch_id=staff.branch_id
    )
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

# NEW endpoint: get all staff with branch name
@app.get("/staff", response_model=List[schemas.StaffWithBranch])
def get_staff(db: Session = Depends(get_db)):
    staff_list = db.query(models.StaffUser).all()
    result = []
    for s in staff_list:
        branch = db.query(models.Branch).filter(models.Branch.branch_id == s.branch_id).first()
        result.append({
            "username": s.username,
            "official_role": s.official_role,
            "branch_id": s.branch_id,
            "branch_name": branch.branch_name if branch else None
        })
    return result
