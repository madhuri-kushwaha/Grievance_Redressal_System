from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import SessionLocal, engine
from models import Base, User, Complaint
import random

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    phone: str
    role: str = "user"  # Default to user, can be set to "admin"

@app.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check existing user
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user with role
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        password=user_data.password,
        phone=user_data.phone,
        role=user_data.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {
        "access_token": f"token_{db_user.id}", 
        "user_id": db_user.id,
        "role": db_user.role,
        "username": db_user.username
    }

class LoginData(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(login_data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.email == login_data.email,
        User.password == login_data.password  # Production mein hash karo
    ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "access_token": f"token_{user.id}", 
        "user_id": user.id,
        "role": user.role,
        "username": user.username
    }

class ComplaintCreate(BaseModel):
    title: str
    description: str
    user_id: int
    ticket_id: Optional[str] = None

class ComplaintResponse(BaseModel):
    ticket_id: str
    status: str

@app.post("/complaint", response_model=ComplaintResponse)
def create_complaint(complaint_data: ComplaintCreate, db: Session = Depends(get_db)):
    try:
        # Generate ticket_id if not provided
        if not complaint_data.ticket_id:
            # Generate unique ticket_id with retry logic
            max_attempts = 10
            for attempt in range(max_attempts):
                ticket_id = f"GRS{random.randint(10000, 99999)}"
                existing = db.query(Complaint).filter(Complaint.ticket_id == ticket_id).first()
                if not existing:
                    break
                if attempt == max_attempts - 1:
                    raise HTTPException(status_code=500, detail="Unable to generate unique ticket ID")
        else:
            ticket_id = complaint_data.ticket_id
            # Check if custom ticket_id already exists
            existing = db.query(Complaint).filter(Complaint.ticket_id == ticket_id).first()
            if existing:
                raise HTTPException(status_code=400, detail=f"Ticket ID '{ticket_id}' already exists")
        
        complaint = Complaint(
            ticket_id=ticket_id,
            title=complaint_data.title,
            description=complaint_data.description,
            user_id=complaint_data.user_id,
            status="Pending"
        )
        
        db.add(complaint)
        db.commit()
        db.refresh(complaint)
        return {
            "ticket_id": complaint.ticket_id,
            "status": complaint.status
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/user/complaints/{user_id}")
def get_user_complaints(user_id: int, db: Session = Depends(get_db)):
    complaints = db.query(Complaint).filter(Complaint.user_id == user_id).all()
    return complaints

class ComplaintUpdate(BaseModel):
    status: str
    solution: str = None

@app.put("/complaint/{complaint_id}")
def update_complaint(complaint_id: int, complaint_data: ComplaintUpdate, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    complaint.status = complaint_data.status
    if complaint_data.solution:
        complaint.solution = complaint_data.solution
    
    db.commit()
    db.refresh(complaint)
    return {"message": "Complaint updated successfully", "complaint": complaint}

@app.get("/admin/complaints")
def get_all_complaints(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).all()
    return complaints

class PasswordUpdate(BaseModel):
    email: str
    new_password: str

@app.put("/update-password")
def update_password(password_data: PasswordUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == password_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.password = password_data.new_password
    db.commit()
    db.refresh(user)
    return {"message": "Password updated successfully"}

@app.delete("/complaint/{complaint_id}")
def delete_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    db.delete(complaint)
    db.commit()
    return {"message": "Complaint deleted successfully"}