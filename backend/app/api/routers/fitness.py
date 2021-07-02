from fastapi import APIRouter, Depends
# from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime, date
import pandas as pd

from ...models.fitness import Fitness
from ...schemas.fitness_schema import FitnessBase, FitnessInput, AggOutput
from ...sql.database import SessionLocal, engine

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
    return get_fitness_records(db)

@router.get('/period')
async def get_period(end: str = "01-01-2020", 
               start: str = "01-01-1970",
               db: Session = Depends(get_db)):
    start_dt = datetime.strptime(start, "%m-%d-%Y").date()
    end_dt = datetime.strptime(end, "%m-%d-%Y").date()
    return db.query(Fitness) \
             .filter(Fitness.fitnessdate >= start_dt) \
             .filter(Fitness.fitnessdate <= end_dt) \
             .all() 

@router.get('/record/{id}', response_model=FitnessBase)
async def get_fitness_by_id(id: int, db: Session = Depends(get_db)):
    return db.query(Fitness).filter(Fitness.fitnessid == id).first()

@router.get('/weeksum', response_model=AggOutput)
async def get_weeklysum(end: str = "01-13-2020", 
               start: str = "01-01-1970",
               db: Session = Depends(get_db)):
    query = f"select * from fitness where fitnessdate between '{start}' and '{end}'"
    df = pd.read_sql_query(query, con=engine)
    if df.shape[0] > 0:
        df['week'] = [x.isocalendar()[1] for x in df.fitnessdate]
        aggdf = df.groupby('week').agg('sum')
        output = [{'week': idx, 'minutes': x} for idx, x in zip(aggdf.index, aggdf.fitnessminutes)]
    else:
        output = [{}]
    return {'count': df.shape[0], 'agg': output}

@router.get('/weekavg', response_model=AggOutput)
async def get_weeklyavg(end: str = "01-13-2020", 
               start: str = "01-01-1970",
               db: Session = Depends(get_db)):
    # TODO: Should take into account for days not included in average (lambda?)
    query = f"select * from fitness where fitnessdate between '{start}' and '{end}'"
    df = pd.read_sql_query(query, con=engine)
    if df.shape[0] > 0:
        df['week'] = [x.isocalendar()[1] for x in df.fitnessdate]
        aggdf = df.groupby('week').agg('mean')
        output = [{'week': idx, 'avg_minutes': x} for idx, x in zip(aggdf.index, aggdf.fitnessminutes)]
    else:
        output = [{}]
    return {'count': df.shape[0], 'agg': output}

@router.get('/weekvals', response_model=List[dict])
async def get_weekvals(db: Session = Depends(get_db)):
    # TODO: Implement
    return [{'week': 1, 'vals': [{'day': 'mon', 'val': 1}]}]

@router.post('/add')
async def add_fitness(fitness: FitnessInput, db: Session = Depends(get_db)):
    new_fitness = Fitness(
        fitnessdate = fitness.fitnessdate,
        fitnessminutes = fitness.fitnessminutes)
    db.add(new_fitness)
    db.commit()
    
    return new_fitness.to_dict()

@router.put('/update/{id}')
async def update_fitness(
    id: int,
    fitness: FitnessBase,
    db: Session = Depends(get_db)
    ):
    db.query(Fitness) \
            .filter(Fitness.fitnessid == id) \
            .update({
                Fitness.fitnessminutes: fitness.fitnessminutes,
                Fitness.fitnessdate: fitness.fitnessdate}) 

    db.commit()
    return db.query(Fitness).filter(Fitness.fitnessid == id).first().to_dict()

@router.delete('/remove/{id}')
async def delete_fitness(id: int, db: Session = Depends(get_db)):
    db.query(Fitness).filter(Fitness.fitnessid == id).delete()
    db.commit()
    return f'Successful Deletion of record <fitnessid: {id}>'
