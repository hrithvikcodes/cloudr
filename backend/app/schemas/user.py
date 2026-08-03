import uuid
from pydantic import BaseModel, ConfigDict

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    pass

class UserOut(UserBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)