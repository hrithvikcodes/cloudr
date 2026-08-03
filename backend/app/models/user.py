import uuid
from typing import List, TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base
if TYPE_CHECKING:
    from app.models.song import Song
    from app.models.liked import Liked
    from app.models.recently_played import RecentlyPlayed
class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    songs: Mapped[List["Song"]] = relationship(back_populates="user")
    liked_songs: Mapped[List["Liked"]] = relationship(back_populates="user")
    recently_played: Mapped[List["RecentlyPlayed"]] = relationship(back_populates="user")