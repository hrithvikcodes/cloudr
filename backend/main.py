
from fastapi import FastAPI
from app.core import db
from contextlib import asynccontextmanager

from fastapi.middleware.cors import CORSMiddleware
from app.routers import song, liked, user, recent

@asynccontextmanager

async def lifespan(app: FastAPI):
    yield
    await db.engine.dispose()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://172.19.255.104:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(song.router)

app.include_router(user.router)
app.include_router(liked.router)
app.include_router(recent.router)
@app.get("/health")
async def health_check():
    return {"status": "OK"}