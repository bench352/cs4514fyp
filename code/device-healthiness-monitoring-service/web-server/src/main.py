from contextlib import asynccontextmanager

import env
import fastapi
import repository.anomaly
import router.anomaly_data
import router.post_data
import router.real_time
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

server_config = env.ServerConfig()


@asynccontextmanager
async def lifespan(_: fastapi.FastAPI):
    await repository.anomaly.AnomalyRepository.init_connection_pool()
    logger.info("Connection pool initialized")
    yield


app = fastapi.FastAPI(
    title="Device Healthiness Monitoring Service",
    description="""
    Serve **anomaly detection results** from the database via REST APIs
    and provide real-time anomaly detection results to clients via WebSocket.
    """,
    lifespan=lifespan,
    root_path=server_config.path_prefix,
)

app.include_router(router.post_data.router, prefix="/api/internal")
app.include_router(router.anomaly_data.router)
app.include_router(router.real_time.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/probes/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app", host="0.0.0.0", port=server_config.port, reload=server_config.reload
    )
