from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

import env

app_db_conn_str = f"postgresql+psycopg2://{env.POSTGRES_USER}:{env.POSTGRES_PASSWORD}@{env.POSTGRES_HOST}/{env.POSTGRES_DB}"

app_db_engine = create_engine(
    app_db_conn_str,
    pool_size=20,
    max_overflow=0,
    echo=True,
)

app_db_session = sessionmaker(app_db_engine)


def get_session() -> Session:
    return app_db_session(autoflush=True)
