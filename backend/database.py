import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Database Connection - MySQL Primary
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "mysql+pymysql://root:@localhost:3306/grievance_db"
)

try:
    engine = create_engine(DATABASE_URL)
    # Test connection
    with engine.connect() as conn:
        pass
    print(f"Connected to database: {DATABASE_URL}")
except Exception as e:
    print(f"MySQL connection failed: {e}")
    print("Please ensure MySQL server is running...")
    raise Exception("MySQL connection required. Please start MySQL server.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()