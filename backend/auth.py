from sqlalchemy.orm import Session
from models import User

def register_user(db: Session, data):
    user = db.query(User).filter(User.email == data["email"]).first()
    if user:
        return {"error": "Already registered"}

    new_user = User(**data)
    db.add(new_user)
    db.commit()
    return {"msg": "Registered"}


def login_user(db: Session, data):
    user = db.query(User).filter(
        User.email == data["email"],
        User.password == data["password"]
    ).first()

    if not user:
        return {"error": "Invalid credentials"}

    return {"msg": "Login success", "user_id": user.id}