import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class SongBase(BaseModel):
    title: str
    artist: str | None = None
    duration_seconds: int
    file_size_bytes: int
    file_path: str
    mime_type: str | None = None

class SongCreate(SongBase):
    title: str | None = None
    artist: str | None = None
    # user_id comes from auth later, not client input
    # NOTE: file_path/file_size_bytes/duration_seconds will move to
    # server-derived values once real file upload is built — fine for now
    # since you're testing with manual inserts.

class SongOut(SongBase):
    id: uuid.UUID
    user_id: uuid.UUID
    is_autoclassified: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)