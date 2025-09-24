from sqlalchemy.orm import Session
from models import Staff_User
from schemas import StaffCreate

# Fetch all staff
def get_staff(db: Session):
    return db.query(Staff_User).all()

# Delete staff
def delete_staff(db: Session, username: str):
    staff = db.query(Staff_User).filter(Staff_User.username == username).first()
    if staff:
        db.delete(staff)
        db.commit()
        return True
    return False
