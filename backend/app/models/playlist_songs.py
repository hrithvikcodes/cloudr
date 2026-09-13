from datetime import datetime
from sqlalchemy import func, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base
import uuid
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.user import User
    from app.models.song import Song
    from app.models.playlists import Playlists
class PlaylistSongs(Base):
    __tablename__ = "playlist_songs"
    __table_args__ = (UniqueConstraint("playlist_id", "song_id", name="uq_song_playlist"),)


    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)

    song_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("songs.id"), nullable=False)
    playlist_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("playlists.id"), nullable=False)
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    song: Mapped["Song"] = relationship(back_populates="playlist_songs")
    playlist: Mapped["Playlists"] = relationship(back_populates="playlist_songs")
    