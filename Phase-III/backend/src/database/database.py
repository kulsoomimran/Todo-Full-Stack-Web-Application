from sqlmodel import create_engine, Session
from sqlalchemy import event
from sqlalchemy.pool import Pool
import os
from dotenv import load_dotenv

# Import models to register them with SQLModel
from ..models.user_model import User  # noqa: F401
from ..models.todo_model import Todo  # noqa: F401

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create engine with appropriate configuration
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # PostgreSQL connection with SSL configuration for Neon
    connect_args = {
        "sslmode": "require"
    }

engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL debugging
    connect_args=connect_args,
    pool_pre_ping=True,  # Test connections before using them
    pool_recycle=300,  # Recycle connections after 5 minutes
    pool_size=5,  # Maximum number of connections to keep open
    max_overflow=10  # Maximum overflow connections
)

def get_session():
    """Get database session for dependency injection"""
    with Session(engine) as session:
        yield session


def create_tables():
    """Create all database tables"""
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)

# Optional: Add connection pooling events if needed
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Set SQLite pragmas for better performance (only for SQLite)"""
    if DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()