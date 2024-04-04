# Docker Compose Files for Dependencies

This directory contains the [Docker Compose](https://docs.docker.com/compose/) file for spinning up the necessary
dependencies required by this system. They are primary for development purposes.

- `./timescaledb`: For spinning up an [TimescaleDB](https://www.timescale.com/) instance.
    - Username: `postgres` Password: `password`
- `./kafka`: For spinning up an [Apache Kafka](https://kafka.apache.org/)
  instance [packaged by Bitnami](https://github.com/bitnami/containers/tree/main/bitnami/kafka).
    - No user authentication is enabled
- `./mqtt`: For spinning up an [MQTT](https://mqtt.org/)
  broker [packaged by Eclipse Mosquitto](https://hub.docker.com/_/eclipse-mosquitto/).
    - Username: `admin` Password: `password`

## Usage

1. `cd` to the directory corresponding to the application to be spin up.
2. Run `docker-compose up -d` to spin up the application in Docker.