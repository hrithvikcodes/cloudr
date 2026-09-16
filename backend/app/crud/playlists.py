
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.models.playlists import Playlists
from app.models.playlist_songs import PlaylistSongs



async def get_playlist_by_id(db: AsyncSession, playlist_id: uuid.UUID):
    return await db.get(Playlists, playlist_id)

async def get_playlists_for_user(db: AsyncSession, user_id: uuid.UUID):
    user_playlist_query = (
        select(Playlists, func.count(PlaylistSongs.id))
        .outerjoin(PlaylistSongs, PlaylistSongs.playlist_id == Playlists.id)
        .where(Playlists.user_id == user_id)
        .group_by(Playlists.id)
    )
    result = await db.execute(user_playlist_query)
    return result.all()

async def create_playlist(db: AsyncSession, user_id: uuid.UUID, name: str) -> Playlists:
    playlist = Playlists(user_id=user_id, name=name)
    db.add(playlist)
    await db.commit()
    return playlist

async def rename_playlist(db: AsyncSession, playlist: Playlists, name: str) -> Playlists:
    playlist.name = name
    await db.commit()
    return playlist

async def delete_playlist(db: AsyncSession, playlist: Playlists) -> None :
    await db.delete(playlist)
    await db.commit()
