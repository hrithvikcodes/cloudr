

from sqlalchemy import select, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.models.liked import Liked
from sqlalchemy.orm import selectinload

from sqlalchemy.exc import IntegrityError

async def like_song(db: AsyncSession, song_id: uuid.UUID, user_id: uuid.UUID):
    new_like = Liked(song_id=song_id, user_id=user_id)
    db.add(new_like)
    try:
        await db.commit()
        
    except IntegrityError:
        await db.rollback()
        return None  # already liked
    result = await db.execute(
        select(Liked).options(selectinload(Liked.song)).where(Liked.id == new_like.id)
    )
    return result.scalar_one_or_none()

async def unlike_song(db: AsyncSession, song_id: uuid.UUID, user_id: uuid.UUID):
    liked_query = (
        select(Liked)
        .options(selectinload(Liked.song))
        .where(Liked.song_id == song_id, Liked.user_id == user_id)

    )
    result = await db.execute(liked_query)
    song_to_unlike =  result.scalar_one_or_none()
    if(song_to_unlike):
        await db.delete(song_to_unlike)

        await db.commit()
    return song_to_unlike

async def get_liked_songs(db: AsyncSession,  user_id: uuid.UUID):
    liked_songs_query = select(Liked).options(selectinload(Liked.song)).where(Liked.user_id == user_id)
    result = await db.execute(liked_songs_query)

    return result.scalars().all()

async def check_song_liked(db: AsyncSession, song_id: uuid.UUID, user_id: uuid.UUID):
    liked_check_query  = select(Liked).where(Liked.song_id == song_id).where(Liked.user_id == user_id)
    result = await db.execute(liked_check_query)
    return result.scalar_one_or_none()

async def count_liked_songs(db: AsyncSession, user_id: uuid.UUID) -> int:
    result = await db.execute(
        select(func.count()).select_from(Liked).where(Liked.user_id == user_id)
    )
    return result.scalar_one()



