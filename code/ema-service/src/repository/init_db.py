import fastapi
from logic import user
from loguru import logger
from repository.connection import app_db_conn_str, app_db_engine
from repository.user import UserRepository
from sqlalchemy_utils import create_database, database_exists

import env
from schemas import models, rest, enums

user_repo = UserRepository()


def _create_admin_user():
    try:
        if user_repo.read_by_username(env.MASTER_ADMIN_USERNAME):
            return
    except fastapi.HTTPException:
        logger.info("Our master is not here yet, creating account for Master Admin...")
    user.create_new_user(
        rest.UserCreate(
            username=env.MASTER_ADMIN_USERNAME,
            full_name="Master Admin",
            init_password=env.MASTER_ADMIN_PASSWORD,
            role=enums.Role.LANDLORD,
        )
    )
    logger.info("Greetings Master Admin, your account is ready to use!")


def init_db_and_schema():
    if not database_exists(app_db_conn_str):
        logger.info("Database [{}] do not exist, creating...", env.POSTGRES_DB)
        create_database(app_db_conn_str)
    logger.info("Initializing database schema for [{}]...", env.POSTGRES_DB)
    models.Base.metadata.create_all(bind=app_db_engine)
    logger.info("Schema initialized for database [{}], enjoy!", env.POSTGRES_DB)
    _create_admin_user()
