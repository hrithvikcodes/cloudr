import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class RecentlyPlayedCreate(BaseModel):
    song_id: uuid.UUID

class RecentlyPlayedOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    song_id: uuid.UUID
    played_at: datetime

    model_config = ConfigDict(from_attributes=True)