from datetime import datetime
from sqlalchemy import func, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base
from typing import List
import uuid
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.user import User
    from app.models.song import Song
    from app.models.playlist_songs import PlaylistSongs
class Playlists(Base):
    __tablename__ = "playlists"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    user: Mapped["User"] = relationship(back_populates="playlists")
    playlist_songs: Mapped[List["PlaylistSongs"]] = relationship(back_populates="playlist", cascade="all, delete-orphan")
    