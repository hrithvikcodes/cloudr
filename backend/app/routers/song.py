from app.core.auth import get_current_user
from app.core.config import settings
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.crud.song import create_song, get_song_by_id, get_songs_by_user, delete_song, get_user_storage, count_songs_by_user
from app.schemas.song import SongOut
from app.schemas.song import PresignUploadResponse, PresignUploadRequest, ConfirmUploadRequest
from app.core.r2 import r2_client
from app.core.r2 import R2_BUCKET_NAME

router = APIRouter(prefix="/songs", tags=["songs"])


@router.post("/presign-upload", response_model=PresignUploadResponse)
async def presign_upload(
    payload: PresignUploadRequest,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ext = os.path.splitext(payload.filename)[1]
    key = f"songs/{current_user}/{uuid.uuid4()}{ext}"

    current_usage = await get_user_storage(db=db, user_id=uuid.UUID(current_user))

    current_usage_bytes = current_usage or 0
    file_size_bytes = payload.file_size_bytes or 0
    if int(current_usage_bytes) + int(file_size_bytes) >= settings.MAX_STORAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Storage limit exceeded",
        )

    upload_url = r2_client.generate_presigned_url(
        "put_object",
        Params={
            'Bucket': settings.R2_BUCKET_NAME,
            'Key': key,
            'ContentType': payload.content_type,
        },
        ExpiresIn=300,
    )
    return {'upload_url': upload_url, 'key': key}


@router.post("/confirm-upload", status_code=status.HTTP_201_CREATED, response_model=SongOut)
async def confirm_upload(
    payload: ConfirmUploadRequest,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not payload.key.startswith(f"songs/{current_user}/"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Key does not belong to current user")

    try:
        head = r2_client.head_object(Bucket=R2_BUCKET_NAME, Key=payload.key)
    except r2_client.exceptions.ClientError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Upload not found")

    file_size_bytes = head["ContentLength"]
    final_title = payload.title or os.path.splitext(os.path.basename(payload.key))[0]

    song = await create_song(
        db=db,
        user_id=uuid.UUID(current_user),
        title=final_title,
        artist=payload.artist,
        duration_seconds=payload.duration_seconds,
        file_size_bytes=file_size_bytes,
        file_path=payload.key,
        mime_type=payload.content_type,
    )
    return song


@router.get("/{song_id}/stream")
async def stream_song(
    song_id: uuid.UUID,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    song = await get_song_by_id(db, song_id)
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")

    if song.user_id != uuid.UUID(current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this song")

    url = r2_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.R2_BUCKET_NAME, "Key": song.file_path},
        ExpiresIn=3600,
    )
    return {"url": url}


@router.get("/user/me", response_model=list[SongOut])
async def list_user_songs(
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    songs = await get_songs_by_user(db, uuid.UUID(current_user))
    return songs


@router.get("/{song_id}", response_model=SongOut)
async def get_song(
    song_id: uuid.UUID,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    song = await get_song_by_id(db, song_id)
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")

    if song.user_id != uuid.UUID(current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this song")

    return song


@router.delete("/{song_id}", response_model=SongOut)
async def remove_song(
    song_id: uuid.UUID,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    song = await get_song_by_id(db, song_id)
    if not song:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")

    if song.user_id != uuid.UUID(current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this song")

    deleted_song = await delete_song(db, song_id)
    if deleted_song is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")

    try:
        r2_client.delete_object(Bucket=R2_BUCKET_NAME, Key=deleted_song.file_path)
    except Exception:
        pass
    return deleted_song

@router.get("/storage/me",status_code=status.HTTP_200_OK)
async def get_my_storage(db:AsyncSession=Depends(get_db), current_user: str = Depends(get_current_user)):
    used_bytes = await get_user_storage(db, uuid.UUID(current_user))
    return {
        "used_bytes": used_bytes,
        "limit_bytes": settings.MAX_STORAGE_BYTES,
    }



@router.get("/count/me")
async def get_song_count(
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    count = await count_songs_by_user(db, uuid.UUID(current_user))
    return {"count": count}