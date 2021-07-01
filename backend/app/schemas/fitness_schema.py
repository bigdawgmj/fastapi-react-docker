# from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class FitnessBase(BaseModel):
    fitnessid: int
    fitnessdate: datetime
    fitnessminutes: int

    class Config:
        orm_mode = True
