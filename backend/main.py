
from fastapi import FastAPI
from app.routers import user
from app.core import db
from contextlib import asynccontextmanager
from app.routers import song
from fastapi.middleware.cors import CORSMiddleware
from app.routers import liked

@asynccontextmanager

async def lifespan(app: FastAPI):
    yield
    await db.engine.dispose()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(song.router)

app.include_router(user.router)
app.include_router(liked.router)

@app.get("/health")
async def health_check():
    return {"status": "OK"}