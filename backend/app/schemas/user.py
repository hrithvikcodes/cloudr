import uuid
from pydantic import BaseModel, ConfigDict

class UserBase(BaseModel):
    username: str | None = None

class UserCreate(UserBase):
    id: uuid.UUID
    email: str

class UserOut(UserBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)