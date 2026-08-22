from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.user import create_user, get_user_by_id, get_user_by_username
from app.core.db import get_db
from app.schemas.user import UserCreate
from app.schemas.user import UserOut
import uuid


router = APIRouter(prefix="/user",tags=["user"])


@router.post("/signup",status_code=status.HTTP_201_CREATED, response_model=UserOut)
async def signup(data: UserCreate , db: AsyncSession = Depends(get_db)):
    if data.username is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Username is required")
    db_user = await get_user_by_username(db, data.username)
    if (db_user):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already registered")
    return await create_user(db, data)


@router.get("/me/{user_id}",status_code=status.HTTP_200_OK, response_model = UserOut)
async def get_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_id(db, user_id)
    if(not db_user):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user
    