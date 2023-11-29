# Docker Compose Files for Dependencies

This directory contains the [Docker Compose](https://docs.docker.com/compose/) file for spinning up the necessary dependencies required by this system.

- `./timescaledb`: For spinning up an [TimescaleDB](https://www.timescale.com/) instance.

## Usage

1. `cd` to the directory corresponding to the application to be spin up
2. Run `docker-compose up -d` to spin up the application in Docker.