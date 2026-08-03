from datetime import datetime
from sqlalchemy import func, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base
import uuid
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.user import User
    from app.models.song import Song
class RecentlyPlayed(Base):
    __tablename__ = "recently_played"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    song_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("songs.id"), nullable=False)
    played_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="recently_played")
    song: Mapped["Song"] = relationship(back_populates="play_history")