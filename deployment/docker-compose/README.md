# Deploy Smart Home Management System on Your Own Computer with Docker Compose

The Smart Home Management System can be installed on your computer using Docker Compose. This deployment approach is
provided as an alternative to those who do not have access to a Kubernetes cluster. Using Docker Compose is not
recommended and is only suitable for a quick try-out of the Smart Home Management System.

## Prerequisites

This deployment method assumes you have a basic understanding of Docker, although it should be easy to follow along
without a strong background in it. To carry out this deployment method, you will need these software tools:

- [Docker](https://www.docker.com/): Required to run the Docker Compose file to spin up the Smart Home Management
  System. If you are on Windows or MacOS, you can use [Docker Desktop](https://www.docker.com/products/docker-desktop/).
  If you are a Linux user, you can follow
  the [official Docker installation guide](https://docs.docker.com/engine/install/).
- [curl](https://curl.se/): Used for downloading the necessary configuration files when you follow the deployment steps
  below. If you don't use curl, you can download all the files in this directory to your computer instead.

## Download the Necessary Configurations

You can download the Docker Compose file using the following commands to start the Smart Home Management System. Due to
the design of [Eclipse Mosquitto](https://hub.docker.com/_/eclipse-mosquitto/), the configuration for the MQTT broker
has to be downloaded separately and stored in the `mqtt-config` folder.

```bash
curl -O https://raw.githubusercontent.com/bench352/cs4514fyp/main/deployment/docker-compose/docker-compose.yaml
mkdir mqtt-config && cd mqtt-config
curl -O https://raw.githubusercontent.com/bench352/cs4514fyp/main/deployment/docker-compose/mqtt-config/mosquitto.conf
curl -O https://raw.githubusercontent.com/bench352/cs4514fyp/main/deployment/docker-compose/mqtt-config/passwordfile
```

## Spin Up Using Docker Compose

Change directory (`cd`) back to where you download the `docker-compose.yaml`. Run the following command to start the
entire system:

```bash
docker-compose up -d
```

This command will automatically start all components required to run the Smart Home Management System. Once the
deployment is completed, you can access your freshly deployed instance on http://localhost:3000. Here are the login
credentials of the instance:

- Username: `admin`
- Password: `password`

This deployment comes with demo data. You can learn more about the demo data [here](../../extra-info/DEMO-DATA.md).

In case some components are not started properly and some data cannot be viewed in the Web UI, you can attempt to
resolve it by running the following command on the directory that contains the `docker-compose.yaml` file:

```bash
docker-compose restart
```

> **Note for Accessing Smart Home Management System Externally**
>
> Due to the implementation of the Web UI, the domain/IP for accessing the backend is set to `http://localhost` by
> default, regardless of whether you are accessing the Web UI from the computer that runs the Smart Home Management
> System. To resolve that, you can modify the environment variables of the Web UI in `docker-compose.yaml`. Locate the
> section where the configuration of the Web UI is located, and change all the `localhost` to the public IP of your
> computer:
>
> ```yaml
>   ...
>   web-ui:
>     image: bench352/cs4514-shms-web-ui:latest
>     ports:
>       - 3000:3000
>     environment:
>       - REACT_APP_EMA_SERVICE_URL=http://<ip-of-your-computer>:8000
>       - REACT_APP_DEVICE_DATA_SERVICE_URL=http://<ip-of-your-computer>:8001
>       - REACT_APP_DEVICE_DATA_SERVICE_WS_URL=ws://<ip-of-your-computer>:8001
>       - REACT_APP_DEVICE_HEALTH_SERVICE_URL=http://<ip-of-your-computer>:8002
>       - REACT_APP_DEVICE_HEALTH_SERVICE_WS_URL=ws://<ip-of-your-computer>:8002
> ...
> ```

## Remove The Smart Home Management System

To remove the Smart Home Management System, go to the directory containing the `docker-compose.yaml` and run the
following commands:

```bash
docker-compose down
```

Some Docker Volumes were created during the deployment, so the data of the Smart Home Management System will be retained
in those volumes. To remove the data as well, find out the name of those volumes using the `docker volume ls` command (
the name of Docker Volumes that is related to Smart Home Management System contains `shms` in the name):

```
you@your-computer:~$ docker volume ls
DRIVER    VOLUME NAME
local     docker-compose_shms_kafka_data
local     docker-compose_shms_mosquitto_data
local     docker-compose_shms_timescaledb_data
```

Then remove the volumes one by one by using `docker volume rm`, e.g.

```bash
docker volume rm docker-compose_shms_kafka_data -f
```

