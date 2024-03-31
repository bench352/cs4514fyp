import asyncio
import datetime
import json
import os
import random

import aiomqtt
import httpx
import pytz
from loguru import logger

EMA_SERVICE_URL = os.getenv("EMA_SERVICE_URL")
EMA_USERNAME = os.getenv("EMA_USERNAME")
EMA_PASSWORD = os.getenv("EMA_PASSWORD")

MQTT_HOST = os.getenv("MQTT_HOST")
MQTT_PORT = os.getenv("MQTT_PORT")
MQTT_USERNAME = os.getenv("MQTT_USERNAME")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")
MQTT_TOPIC = os.getenv("MQTT_TOPIC")

token_r = httpx.post(
    f"{EMA_SERVICE_URL}/auth/login",
    headers={"Content-Type": "application/x-www-form-urlencoded"},
    data={"username": EMA_USERNAME, "password": EMA_PASSWORD},
)

if token_r.is_error:
    logger.error(token_r.text)
    exit(1)

token = token_r.json()["access_token"]

device_r = httpx.get(
    f"{EMA_SERVICE_URL}/devices", headers={"Authorization": f"Bearer {token}"}
)

if device_r.is_error:
    logger.error(device_r.text)
    exit(1)

devices = device_r.json()


def get_config():
    return json.load(open("config.json"))


async def random_continuous_generator(
    client: aiomqtt.Client,
    device_name: str,
    device_id: str,
    key: str,
    range_from: float,
    range_to: float,
    time_interval_second: int,
):
    while True:
        value = round(random.uniform(range_from, range_to), 2)
        now_ts = datetime.datetime.now(tz=pytz.utc).isoformat()
        payload = json.dumps(
            {"time": now_ts, "deviceId": device_id, "data": {key: value}}
        )
        await client.publish(MQTT_TOPIC, payload, qos=0)
        logger.info(
            "Device={} timestamp={} key={} value={}", device_name, now_ts, key, value
        )
        await asyncio.sleep(time_interval_second)


async def random_incremental_generator(
    client: aiomqtt.Client,
    device_name: str,
    device_id: str,
    key: str,
    increment_from: float,
    increment_to: float,
    time_interval_second: int,
):
    value = 0
    while True:
        value += round(random.uniform(increment_from, increment_to), 2)
        now_ts = datetime.datetime.now(tz=pytz.utc).isoformat()
        payload = json.dumps(
            {"time": now_ts, "deviceId": device_id, "data": {key: value}}
        )
        await client.publish(MQTT_TOPIC, payload, qos=0)
        logger.info(
            "Device={} timestamp={} key={} value={}", device_name, now_ts, key, value
        )
        await asyncio.sleep(time_interval_second)


async def fixed_generator(
    client: aiomqtt.Client, device_name: str, device_id: str, key: str, value: float
):
    now_ts = datetime.datetime.now(tz=pytz.utc).isoformat()
    payload = json.dumps({"time": now_ts, "deviceId": device_id, "data": {key: value}})
    await client.publish(MQTT_TOPIC, payload, qos=0)
    logger.info(
        "Device={} timestamp={} key={} value={}", device_name, now_ts, key, value
    )


async def main():
    config = get_config()
    async with aiomqtt.Client(
        hostname=MQTT_HOST,
        port=int(MQTT_PORT),
        username=MQTT_USERNAME,
        password=MQTT_PASSWORD,
    ) as client:
        client.pending_calls_threshold = 100000
        tasks = []
        for device in devices:
            for config_item in config:
                if device["name"].startswith(config_item["matchPrefix"]):
                    for data_config in config_item["data"]:
                        if data_config["type"] == "random-continuous":
                            tasks.append(
                                random_continuous_generator(
                                    client,
                                    device["name"],
                                    device["id"],
                                    data_config["key"],
                                    data_config["rangeFrom"],
                                    data_config["rangeTo"],
                                    data_config["timeIntervalSeconds"],
                                )
                            )
                        elif data_config["type"] == "random-incremental":
                            tasks.append(
                                random_incremental_generator(
                                    client,
                                    device["name"],
                                    device["id"],
                                    data_config["key"],
                                    data_config["incrementFrom"],
                                    data_config["incrementTo"],
                                    data_config["timeIntervalSeconds"],
                                )
                            )
                        elif data_config["type"] == "fixed":
                            tasks.append(
                                fixed_generator(
                                    client,
                                    device["name"],
                                    device["id"],
                                    data_config["key"],
                                    data_config["value"],
                                )
                            )
                        else:
                            logger.error(f"Unknown data type: {data_config['type']}")
        logger.info("Starting MQTT producer")
        await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
