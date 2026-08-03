from datetime import datetime
from typing import List, TYPE_CHECKING
from sqlalchemy import String, func, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base
import uuid

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.liked import Liked
    from app.models.recently_played import RecentlyPlayed
class Song(Base):
    __tablename__ = "songs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    artist: Mapped[str] = mapped_column(String(255), nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    file_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=True)

    is_autoclassified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="songs")
    liked_by: Mapped[List["Liked"]] = relationship(back_populates="song", cascade="all, delete-orphan")
    play_history: Mapped[List["RecentlyPlayed"]] = relationship(back_populates="song", cascade="all, delete-orphan")