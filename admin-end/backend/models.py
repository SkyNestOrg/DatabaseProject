# backend/models.py
from sqlalchemy import Column, Integer, String, ForeignKey, CHAR
from database import Base

class Branch(Base):
    __tablename__ = "Branch"
    branch_id = Column(Integer, primary_key=True, autoincrement=True)
    branch_name = Column(String(25), nullable=False)
    address = Column(String(75), nullable=False)
    city = Column(String(25), nullable=False)
    contact_number = Column(CHAR(10), nullable=False)

class StaffUser(Base):
    __tablename__ = "Staff_User"
    username = Column(String(20), primary_key=True)
    password = Column(String(255), nullable=False)
    official_role = Column(String(20), nullable=False)
    branch_id = Column(Integer, ForeignKey("Branch.branch_id"), nullable=False)
