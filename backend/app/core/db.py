# app/core/db.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# Engine - manages the actual connection pool to Postgres
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,     # prints every SQL query to console when DEBUG=True, good for learning
    pool_pre_ping=True,      # checks connection is alive before using it, avoids stale-connection errors
)

# Session factory - creates new DB sessions on demand
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,  # keeps objects usable after commit, without this accessing attrs post-commit errors out
    autoflush=False,
)

# Base class - every model (Song, User, etc.) will inherit from this
class Base(DeclarativeBase):
    pass

# Dependency for FastAPI routes - yields a session, closes it after request
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session