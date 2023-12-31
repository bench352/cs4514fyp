import json
import asyncio
import argparse
import aiomqtt
from datetime import datetime
from loguru import logger

parser = argparse.ArgumentParser(description="IoT Device Simulator")

parser.add_argument(
    "--schedule",
    type=str,
    help="A JSON file containing the schedule of all telemetry key for a device",
    default="/data/schedule.json",
)
parser.add_argument(
    "--device-id",
    type=str,
    help="The device id used to identify the device in the system",
)
parser.add_argument("--mqtt-host", type=str, help="The hostname of the MQTT broker")
parser.add_argument("--mqtt-port", type=int, help="The port of the MQTT broker")
parser.add_argument("--mqtt-username", type=str, help="The username of the MQTT broker")
parser.add_argument("--mqtt-password", type=str, help="The password of the MQTT broker")
parser.add_argument(
    "--mqtt-topic", type=str, help="The MQTT topic to publish the telemetry data to"
)
parser.add_argument(
    "mode", type=str, help="Which mode to run the simulator", choices=["rt", "ts"]
)

args = parser.parse_args()


def load_json_schedule(schedule_file: str) -> dict:
    with open(schedule_file) as f:
        return json.load(f)


def generate_mqtt_payload(telemetry_key, timestamp, value) -> str:
    return json.dumps(
        {"time": timestamp, "deviceId": args.device_id, "data": {telemetry_key: value}}
    )


async def produce_in_real_time(key: str, values: list[dict]):
    async with aiomqtt.Client(
        hostname=args.mqtt_host,
        port=int(args.mqtt_port),
        username=args.mqtt_username,
        password=args.mqtt_password,
    ) as client:
        for value in values:
            await asyncio.sleep(value["timeDifference"])
            now_ts = datetime.now().isoformat()
            await client.publish(
                args.mqtt_topic, generate_mqtt_payload(key, now_ts, value["value"])
            )
            logger.info(
                "Produced: ts={}, key={}, value={}", now_ts, key, value["value"]
            )


async def produce_in_time_series(key: str, values: list[dict]):
    async with aiomqtt.Client(
        hostname=args.mqtt_host,
        port=int(args.mqtt_port),
        username=args.mqtt_username,
        password=args.mqtt_password,
    ) as client:
        for value in values:
            await client.publish(
                args.mqtt_topic,
                generate_mqtt_payload(key, value["timestamp"], value["value"]),
            )

            logger.info(
                "Produced: ts={}, key={}, value={}",
                value["timestamp"],
                key,
                value["value"],
            )


async def rt_mode():
    """
    Run the simulator in real-time mode, mimicking a real device producing data in real time.
    The timestamp of the telemetry data will be the current time when the data is sent to the system.
    The frequency of the data is determined by the `timeDifference` defined in the schedule file.
    """

    schedule = load_json_schedule(args.schedule)
    tasks = [produce_in_real_time(key, values) for key, values in schedule.items()]
    await asyncio.gather(*tasks)


async def ts_mode():
    """
    Run the simulator in time-series mode. The timestamp of the telemetry data will follow the `timestamp`, which is
    inherited from the original dataset. All the telemetry data will be sent to the system at once.
    """

    schedule = load_json_schedule(args.schedule)
    tasks = [produce_in_time_series(key, values) for key, values in schedule.items()]
    await asyncio.gather(*tasks)


if args.mode == "rt":
    asyncio.run(rt_mode())
elif args.mode == "ts":
    asyncio.run(ts_mode())
else:
    print("Invalid mode")
