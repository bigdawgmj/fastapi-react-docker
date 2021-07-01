from fastapi import APIRouter, Depends
# from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

from ...models.fitness import Fitness
from ...schemas.fitness_schema import FitnessBase
from ...sql.database import SessionLocal

router = APIRouter(prefix="/api/fitness")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_fitness_records(db: Session):
    return db.query(Fitness).all()


@router.get('/', response_model=List[FitnessBase])
async def get_fitness(db: Session = Depends(get_db)):
    '''
    Retrieve all fitness records.
    '''
    return get_fitness_records(db)


# @router.get('/list/', response_model=List[str])
# async def get_fitness_():
#     '''
#     Retrieve all book titles.
#     '''
#     return [book.title for book in all_books]
