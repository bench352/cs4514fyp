import asyncio
from contextlib import asynccontextmanager

import uvicorn
from env import ServerConfig
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from logic import rt_data_fetching
from loguru import logger
from repository.telemetry import TelemetryRepository
from router import historical, real_time

background_task: asyncio.Task | None = None
server_config = ServerConfig()


@asynccontextmanager
async def lifespan(_: FastAPI):
    global background_task
    await TelemetryRepository.init_connection_pool()
    logger.info("Connection pool initialized")
    background_task = asyncio.create_task(rt_data_fetching.fetch_data_in_background())
    yield


app = FastAPI(
    title="Device Data Service",
    description="""
serve **device-related data** from the database via REST APIs, including the latest and historical data from 
IoT sensors. It also provides a WebSocket endpoint to provide real-time sensor data subscription to clients.
""",
    lifespan=lifespan,
    root_path=server_config.path_prefix,
)

app.include_router(historical.router)
app.include_router(real_time.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/probes/health")
async def health():
    global background_task
    if background_task is None:
        return {"status": "Background task is starting up"}
    if background_task.done():
        raise HTTPException(status_code=500, detail="Background task is done")
    try:
        if background_task.exception():
            raise HTTPException(status_code=500, detail="Background task failed")
    except asyncio.InvalidStateError:
        return {"status": "Background task is running"}
    return {"status": "OK"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app", host="0.0.0.0", port=server_config.port, reload=server_config.reload
    )
