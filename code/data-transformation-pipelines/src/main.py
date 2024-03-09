import argparse
import asyncio

from dotenv import load_dotenv

load_dotenv()

from etl_pipelines.kafka_to_timescaledb import KafkaToTimescaleDBPipeline
from etl_pipelines.mqtt_to_kafka import MQTTToKafkaPipeline

parser = argparse.ArgumentParser(description="Run ETL pipeline")

parser.add_argument(
    "pipeline",
    metavar="pipeline",
    type=str,
    help="Pipeline to run",
    choices=["mqtt_to_kafka", "kafka_to_timescaledb"],
)

args = parser.parse_args()

if args.pipeline == "mqtt_to_kafka":
    asyncio.run(MQTTToKafkaPipeline().run())
elif args.pipeline == "kafka_to_timescaledb":
    asyncio.run(KafkaToTimescaleDBPipeline().run())
