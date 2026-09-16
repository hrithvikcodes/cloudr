
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel
from app.models.song import Song
from app.core.db import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.crud.playlists import (
    get_playlist_by_id,
    get_playlists_for_user,
    create_playlist,
    rename_playlist,
    delete_playlist,
)
from app.crud.playlist_songs import (
    get_songs_in_playlist,
    add_songs_to_playlist,
    remove_song_from_playlist,
)

router = APIRouter(prefix="/playlists", tags=["playlists"])


class PlaylistCreate(BaseModel):
    name: str

class PlaylistRename(BaseModel):
    name: str

class AddSongRequest(BaseModel):
    song_id: uuid.UUID

class PlaylistOut(BaseModel):
    id: uuid.UUID
    name: str
    song_count: int

    class Config:
        from_attributes = True

class SongOut(BaseModel):
    id: uuid.UUID
    title: str
    artist: str | None
    duration_seconds: int

    class Config:
        from_attributes = True



async def _get_owned_playlist(db: AsyncSession, playlist_id: uuid.UUID, user: User):
    playlist = await get_playlist_by_id(db, playlist_id)
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    if playlist.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not your playlist")
    return playlist



@router.get("", response_model=list[PlaylistOut])
async def list_playlists(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    rows = await get_playlists_for_user(db, user.id)
    return [
        PlaylistOut(id=playlist.id, name=playlist.name, song_count=count)
        for playlist, count in rows
    ]


@router.post("", response_model=PlaylistOut, status_code=status.HTTP_201_CREATED)
async def create_playlist_route(
    body: PlaylistCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    playlist = await create_playlist(db, user.id, body.name)
    return PlaylistOut(id=playlist.id, name=playlist.name, song_count=0)


@router.patch("/{playlist_id}", response_model=PlaylistOut)
async def rename_playlist_route(
    playlist_id: uuid.UUID,
    body: PlaylistRename,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    playlist = await _get_owned_playlist(db, playlist_id, user)
    playlist = await rename_playlist(db, playlist, body.name)
    songs = await get_songs_in_playlist(db, playlist_id)
    return PlaylistOut(id=playlist.id, name=playlist.name, song_count=len(songs))


@router.delete("/{playlist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_playlist_route(
    playlist_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    playlist = await _get_owned_playlist(db, playlist_id, user)
    await delete_playlist(db, playlist)


@router.get("/{playlist_id}/songs", response_model=list[SongOut])
async def list_playlist_songs(
    playlist_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    await _get_owned_playlist(db, playlist_id, user)  # ownership check, discard result
    rows = await get_songs_in_playlist(db, playlist_id)
    return [row.song for row in rows]


@router.post("/{playlist_id}/songs", status_code=status.HTTP_201_CREATED)
async def add_song_route(
    playlist_id: uuid.UUID,
    body: AddSongRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    await _get_owned_playlist(db, playlist_id, user)

    song = await db.get(Song, body.song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    if song.user_id != user.id:
        raise HTTPException(status_code=404, detail="Song not found")  # not 403 — see below

    try:
        await add_songs_to_playlist(db, playlist_id, body.song_id)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="Song already in playlist")

    return {"detail": "Song added"}


@router.delete("/{playlist_id}/songs/{song_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_song_route(
    playlist_id: uuid.UUID,
    song_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    await _get_owned_playlist(db, playlist_id, user)
    removed = await remove_song_from_playlist(db, playlist_id, song_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Song not in playlist")