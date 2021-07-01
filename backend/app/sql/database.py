from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = \
        "postgresql://viking:raGnarl0thbr0k@db/fitness"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
