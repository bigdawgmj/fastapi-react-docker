from fastapi import APIRouter
# from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

from ...models.fitness import Fitness
# from schemas.fitness_schema import FitnessBase

router = APIRouter(
    prefix="/api/fitness"
)


def get_fitness_records(db: Session):
    return db.query(Fitness).all()


@router.get('/', response_model=List[Fitness])
async def get_fitness():
    '''
    Retrieve all fitness records.
    '''
    return get_fitness_records(Session)


# @router.get('/list/', response_model=List[str])
# async def get_fitness_():
#     '''
#     Retrieve all book titles.
#     '''
#     return [book.title for book in all_books]
