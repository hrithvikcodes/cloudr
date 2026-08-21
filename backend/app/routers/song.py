
from app.core.config import settings
import os
import uuid
from fastapi import APIRouter, Depends,  HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import os
from app.core.db import get_db
from app.crud.song import create_song, get_song_by_id, get_songs_by_user, delete_song
from app.schemas.song import SongOut
from app.schemas.song import PresignUploadResponse, PresignUploadRequest, ConfirmUploadRequest
from app.core.r2 import r2_client
from app.core.r2 import R2_BUCKET_NAME

router = APIRouter(prefix="/songs", tags=["songs"])

@router.post("/presign-upload", response_model=PresignUploadResponse)
async def presign_upload(payload: PresignUploadRequest, user_id:uuid.UUID, db: AsyncSession = Depends(get_db)):
    
    ext = os.path.splitext(payload.filename)[1]
    key = f"songs/{user_id}/{uuid.uuid4()}{ext}"

    upload_url = r2_client.generate_presigned_url(
        "put_object",
        Params={
            'Bucket': settings.R2_BUCKET_NAME,
            'Key': key,
            'ContentType': payload.content_type,
        },
        ExpiresIn = 300,
    )
    return {'upload_url':upload_url, 'key': key}
@router.post("/confirm-upload", response_model=SongOut)
async def confirm_upload(payload: ConfirmUploadRequest, user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):

    try: 
        head = r2_client.head_object(Bucket = R2_BUCKET_NAME, Key= payload.key)
    except r2_client.exceptions.ClientError: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Upload not found")
    file_size_bytes = head["ContentLength"]
    final_title = payload.title or os.path.splitext(os.path.basename(payload.key))[0]

    song = await create_song(
        db=db,
        user_id=user_id,
        title=final_title,
        artist=payload.artist,
        duration_seconds=payload.duration_seconds,  
        file_size_bytes=file_size_bytes,
        file_path=payload.key,  
        mime_type=payload.content_type,
    )
    return song
@router.get("/{song_id}/stream")
async def stream_song(song_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    song = await get_song_by_id(db, song_id)
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")

    url = r2_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.R2_BUCKET_NAME, "Key": song.file_path},
        ExpiresIn = 3600,
    )
    return {"url": url}

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
    try:
        r2_client.delete_object(Bucket=R2_BUCKET_NAME, Key=deleted_song.file_path)
    except Exception:
        pass
    return deleted_song