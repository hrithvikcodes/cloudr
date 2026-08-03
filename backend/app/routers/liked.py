import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.crud.liked import get_liked_songs, like_song, check_song_liked, unlike_song
from app.schemas.liked import LikedOut

router = APIRouter(prefix="/liked", tags=["Liked"])

def format_liked_response(record) -> dict:
    return {
        "id": record.id,
        "user_id": record.user_id,
        "song_id": record.song_id,
        "liked_at": record.liked_at,
        "title": record.song.title,
        "artist": record.song.artist,
        "duration_seconds": record.song.duration_seconds,
        "file_size_bytes": record.song.file_size_bytes,
        "file_path": record.song.file_path,
        "mime_type": record.song.mime_type
    }

@router.post("/{song_id}", status_code=status.HTTP_201_CREATED, response_model=LikedOut | dict)
async def song_like(song_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await like_song(db, song_id=song_id, user_id=user_id)
    if not result:
        return {"detail": "Already liked"}
    return format_liked_response(result)


@router.delete("/{song_id}", response_model=LikedOut)
async def song_unlike(song_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await unlike_song(db, song_id=song_id, user_id=user_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Like not found")
    # FIXED: Added the formatter here too so 'unlike' returns clean data
    return format_liked_response(result)


@router.get("/user/{user_id}", response_model=list[LikedOut])
async def list_liked(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    # FIXED: Fetch raw SQL records first
    records = await get_liked_songs(db, user_id=user_id)
    # FIXED: Map over each item using your formatter function
    return [format_liked_response(record) for record in records]


@router.get("/check/{song_id}")
async def is_liked(song_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await check_song_liked(db, song_id=song_id, user_id=user_id)
    return {"liked": bool(result)}
