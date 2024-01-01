from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

import env
import router.user
from repository import init_db


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db.init_db_and_schema()
    yield


app = FastAPI(
    title="Entity Management & Authentication Service",
    description="""
An **identity and entity management service** for serving data that represents the detailed information 
of every entity in the system (including users, rooms and devices) as well as mapping each IoT device 
to rooms and users. It also manages credentials for all users in the system and lets other services look 
up the permission of a given user for authorisation. 
""",
    lifespan=lifespan,
)
app.include_router(router.floor.router)
app.include_router(router.flat.router)
app.include_router(router.device.router)
app.include_router(router.user.router)
app.include_router(router.auth.router)


@app.get("/probes/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=env.PORT, reload=env.RELOAD)
