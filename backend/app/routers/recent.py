
from app.crud.song import get_song_by_id
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.recently_played import RecentlyPlayedCreate, RecentlyPlayedOut
from app.core.db import get_db
from sqlalchemy import select
from app.models.recently_played import RecentlyPlayed
from app.models.song import Song
from sqlalchemy.orm import selectinload
from app.core.auth import get_current_user


router = APIRouter(prefix="/recent", tags=["Recent"])
def format_recently_played_response(record) -> dict:
    return {
        "id": record.id,
        "user_id": record.user_id,
        "song_id": record.song_id,
        "played_at": record.played_at,
        "title": record.song.title,
        "artist": record.song.artist,
        "duration_seconds": record.song.duration_seconds,
        "file_size_bytes": record.song.file_size_bytes,
        "file_path": record.song.file_path,
        "mime_type": record.song.mime_type,
    }

@router.post("/{songId}",response_model=RecentlyPlayedOut, status_code= status.HTTP_201_CREATED)
async def postRecentlyPlayed(songId: uuid.UUID, current_user: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    song = await get_song_by_id(db=db, song_id=songId)

    if(song is None):
       raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail= "Song not found")
    
    
    db_recentSong = RecentlyPlayed(song_id = songId, user_id = current_user)
    db.add(db_recentSong)
    await db.commit()
    result = await db.execute(
        select(RecentlyPlayed)
        .options(selectinload(RecentlyPlayed.song))
        .where(RecentlyPlayed.id == db_recentSong.id)
    )
    recent = result.scalar_one()

    return format_recently_played_response(recent)

@router.get("/songs", response_model=list[RecentlyPlayedOut], status_code=status.HTTP_200_OK)
async def get_recentSong(current_user: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    recent_query = await db.execute(
        select(RecentlyPlayed)
        .options(selectinload(RecentlyPlayed.song))
        .where(RecentlyPlayed.user_id == current_user)
        .order_by(RecentlyPlayed.played_at.desc())
        .limit(15)
    )
    recent = recent_query.scalars().all()

    return [format_recently_played_response(r) for r in recent]