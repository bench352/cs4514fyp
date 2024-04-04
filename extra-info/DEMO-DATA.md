# Demo Data for Smart Home Management System

Demo data is created alongside the system to demonstrate the capability of the system without prior setup. If you opt for the demo data during deployment, your fresh installation of the **Smart Home Management System** will come with a set of demo entities as well as additional user accounts listed below.

## Included in the Demo

Here are the entities that are included in the demo:

**3 Floors**

- `1/F`
- `2/F`
- `3/F`

**2 Flats for each Floor (`<floor-no>` indicates the floor number, e.g. `1`)**

- `Flat <floor-no>A`
- `Flat <floor-no>B`

**3 Devices for each Flat (`<flat-name>` indicate the flat name, e.g. `1A`)**

- Flat-wide Energy Meter (`energy-meter-<flat-name>`)
- Multi-Color Smart Light in Living Room (`smart-light-living-room-<flat-name>`)
- Thermostat in Bedroom (`thermostat-bedroom-<flat-name>`)

> The devices mentioned above are powered by the Random Data Generator, which produces random numbers for the sensor readings to make them look like they are working in the system. You will be able to see real-time telemetry data as well as anomaly detection results for those devices, but note that the anomaly detection result would not be accurate due to the unpredictable nature of random-generated data.

**1 special Device for `Flat 1A`**

- `a-simulated-sensor`

> This device is powered by an IoT Device Simulator using IoT sensor data adopted from the [AnoML-IoT](https://www.kaggle.com/datasets/hkayan/anomliot) dataset to mimic the behavior of a real-world IoT device and demonstrate the capability of the system to perform anomaly detection.

**2 Users (apart from the default `Master Admin` account)**

| Username    | Password    | Full Name  | Role     | Assigned to Flat |
|-------------|-------------|------------|----------|------------------|
| `chriswong` | `chriswong` | Chris Wong | Resident | Flat 1A          |
| `johnsmith` | `johnsmith` | John Smith | Resident | Flat 1B          |

