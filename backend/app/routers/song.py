# app/routers/song.py
import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from mutagen import File as MutagenFile

from app.core.db import get_db
from app.crud.song import create_song, get_song_by_id, get_songs_by_user, delete_song
from app.schemas.song import SongOut

router = APIRouter(prefix="/songs", tags=["songs"])

UPLOAD_DIR = "uploads"


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=SongOut)
async def upload_song(
    user_id: uuid.UUID,
    file: UploadFile = File(...),
    title: str | None = Form(None),
    artist: str | None = Form(None),
    db: AsyncSession = Depends(get_db),
):
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1]
    unique_name = f"{uuid.uuid4()}{ext}"
    save_path = os.path.join(UPLOAD_DIR, unique_name)

    contents = await file.read()
    with open(save_path, "wb") as f:
        f.write(contents)

    file_size_bytes = len(contents)

    audio = MutagenFile(save_path)
    if audio is None or audio.info is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not read audio file")
    duration_seconds = int(audio.info.length)

    filename = file.filename or ""
    final_title = title or os.path.splitext(filename)[0]

    song = await create_song(
        db=db,
        user_id=user_id,
        title=final_title,
        artist=artist,
        duration_seconds=duration_seconds,
        file_size_bytes=file_size_bytes,
        file_path=save_path,
        mime_type=file.content_type,
    )
    return song


@router.get("/{song_id}", response_model=SongOut)
async def get_song(song_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    song = await get_song_by_id(db, song_id)
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")
    return song


@router.get("/user/{user_id}", response_model=list[SongOut])
async def list_user_songs(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    songs = await get_songs_by_user(db, user_id)
    return songs


@router.delete("/{song_id}", response_model=SongOut)
async def remove_song(song_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    deleted_song = await delete_song(db, song_id)
    if not deleted_song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")
    return deleted_song