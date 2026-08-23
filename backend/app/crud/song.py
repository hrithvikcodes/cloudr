from sqlalchemy import select, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.models.song import Song
from app.models.liked import Liked
async def create_song(
        db: AsyncSession,
        user_id: uuid.UUID,
        title: str,
        artist: str | None,
        duration_seconds: int,
        file_size_bytes: int,
        file_path: str,
        mime_type: str | None
):
    new_song = Song(
        user_id = user_id,
        title = title,
        artist = artist,
        duration_seconds = duration_seconds,
        file_size_bytes = file_size_bytes,
        file_path = file_path,
        mime_type = mime_type
    )
    db.add(new_song)
    await db.commit()
    await db.refresh(new_song)
    return new_song

async def get_song_by_id(db: AsyncSession, song_id: uuid.UUID):
    song_query = select(Song).where(Song.id == song_id)
    result = await db.execute(song_query)
    return result.scalar_one_or_none()

async def get_songs_by_user(db: AsyncSession, user_id: uuid.UUID):
    songs_query = select(Song).where(Song.user_id == user_id)
    result = await db.execute(songs_query)
    return result.scalars().all()

async def delete_song(db: AsyncSession, song_id: uuid.UUID):
    song_to_delete = await get_song_by_id(db,song_id)
    if(song_to_delete):
        
        await db.delete(song_to_delete)

        await db.commit()
    return song_to_delete

async def get_user_storage(db:AsyncSession, user_id: uuid.UUID):
    result = await db.execute(
        select(func.coalesce(func.sum(Song.file_size_bytes), 0)).where(Song.user_id == user_id)
    )
    return result.scalar_one_or_none()

async def count_songs_by_user(db: AsyncSession, user_id: uuid.UUID) -> int:
    result = await db.execute(
        select(func.count()).select_from(Song).where(Song.user_id == user_id)
    )
    return result.scalar_one()



    