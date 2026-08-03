from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
import uuid
from app.schemas.user import UserCreate


async def create_user(db: AsyncSession, user_data: UserCreate):

    new_user = User(**user_data.model_dump())
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID):

    user_query = select(User).where(User.id == user_id)
    result = await db.execute(user_query)
    return result.scalar_one_or_none()

async def get_user_by_username(db:AsyncSession, username: str ):

    user_query = select(User).where(User.username == username)
    result = await db.execute(user_query)
    return result.scalar_one_or_none()