from datetime import datetime
from sqlalchemy import func, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base
from typing import TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.song import Song
class Liked(Base):
    __tablename__ = "liked"
    __table_args__ = (UniqueConstraint("user_id", "song_id", name="uq_user_song_liked"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    song_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("songs.id"), nullable=False)
    liked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="liked_songs")
    song: Mapped["Song"] = relationship(back_populates="liked_by")