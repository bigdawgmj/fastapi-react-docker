from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import books, fitness


app = FastAPI()

origins = [
        "http://localhost:3000",
        "localhost:3000",
        "http://localhost:3001",
        "localhost:3001"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins='*',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root() -> dict:
    return {"message": "Hello World"}

app.include_router(books.router)
app.include_router(fitness.router)
