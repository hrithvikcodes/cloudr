from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.playlist_songs import PlaylistSongs
from app.models.song import Song
from sqlalchemy.orm import selectinload
from sqlalchemy.engine import CursorResult
from typing import cast
import uuid



async def get_songs_in_playlist(db:AsyncSession, playlist_id: uuid.UUID):
    stmt = (
        select(PlaylistSongs)
        .options(selectinload(PlaylistSongs.song))
        .where(PlaylistSongs.playlist_id == playlist_id)
        .order_by(PlaylistSongs.added_at.asc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()

async def add_songs_to_playlist(db: AsyncSession, playlist_id: uuid.UUID, song_id: uuid.UUID):
    new_song = PlaylistSongs(playlist_id = playlist_id, song_id = song_id)
    db.add(new_song)
    await db.commit()
    return new_song

async def remove_song_from_playlist(db:AsyncSession, playlist_id: uuid.UUID, song_id: uuid.UUID):
    stmt = delete(PlaylistSongs).where(
        PlaylistSongs.playlist_id == playlist_id,
        PlaylistSongs.song_id == song_id,
    )
    result = cast(CursorResult, await db.execute(stmt))
    await db.commit()
    return result.rowcount > 0