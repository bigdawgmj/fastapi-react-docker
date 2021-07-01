from sqlalchemy import Column, Integer, Date

from ..sql.database import Base


class Fitness(Base):
    __tablename__ = "fitness"

    fitnessid = Column(Integer, primary_key=True, index=True)
    fitnessdate = Column(Date, index=True)
    fitnessminutes = Column(Integer)
