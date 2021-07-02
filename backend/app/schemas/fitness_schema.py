from typing import List, Optional
from pydantic import BaseModel
from datetime import date
# from sqlalchemy.types import Date


class FitnessBase(BaseModel):
    fitnessid: int
    fitnessdate: date
    fitnessminutes: int

    class Config:
        orm_mode = True

class FitnessInput(BaseModel):
    fitnessdate: str
    fitnessminutes: int


class AggOutput(BaseModel):
    count: int
    agg: List[dict]
