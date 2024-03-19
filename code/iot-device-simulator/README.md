# IoT Device Simulator

## Dataset Used

- [AnoML-IoT](https://www.kaggle.com/datasets/hkayan/anomliot)

## Generate Schedule for the Simulator

1. Download and put the `dataset_final.csv` dataset in the `datasets` directory.
2. Run all the cells in the `transform_dataset.ipynb` notebook
3. Now you have your `schedule.json` file, which the simulator will use to generate the data

## Run the Simulator

Run the IoT Device Simulator Docker container with the following command. Here is the command to run the IoT Device
Simulator Docker container:

```bash
docker run \
bench352/cs4514-iot-device-simulator:latest poetry run python3 main.py \
--device-id <id-of-device-to-simulate> \
--mqtt-host host.docker.internal \
--mqtt-port 1883 \
--mqtt-username <mqtt-username> \
--mqtt-password <mqtt-password> \
--mqtt-topic rt-telemetry-data \
rt
```

Replace `<path-to-schedule-json-file-on-your-computer>` with the path to the `schedule.json` file on your computer So
the simulator can read it within the Docker container. You should configure the following arguments appropriately too:

| Argument          | Description                                                                                                                                                                                                                                                                                     |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--schedule`      | The path to the `schedule.json` file on your computer (optional when running with Docker since the image already contained one)                                                                                                                                                                 |
| `--device-id`     | The ID of the device that is already registered in the Smart Home Management System                                                                                                                                                                                                             |
| `--mqtt-host`     | The IP or the domain of the MQTT broker to produce data to. Note: If you are running your MQTT broker locally, use `host.docker.internal` instead of `localhost`                                                                                                                                |
| `--mqtt-port`     | The port of the MQTT broker to produce data to                                                                                                                                                                                                                                                  |
| `--mqtt-username` | The username of the MQTT broker                                                                                                                                                                                                                                                                 |
| `--mqtt-password` | The password of the MQTT broker                                                                                                                                                                                                                                                                 |
| `--mqtt-topic`    | The MQTT topic that the Data Transformation Pipelines subscribed to                                                                                                                                                                                                                             |
| `rt`              | The type of the device to simulate. It can be one of two options:<br />`rt`: Run the simulator in real-time mode, mimicking a real device producing data in real-time.<br />`ts`: Run the simulator in time-series mode. Inject the entire dataset with the original timestamp into the system. |

