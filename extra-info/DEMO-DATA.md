# Demo Data for Smart Home Management System

If you opt for the demo data during deployment, your fresh installation of the **Smart Home Management System** will
come with a set of demo entities as well as additional user accounts to illustrate the potential use cases of this
system.

## Included in the Demo

Here are the entities that are included in the demo:

**3 Floors**

- `1/F`
- `2/F`
- `3/F`

**2 Flats for each floor (`<floor-no>` indicates the floor number, e.g. `1`)**

- `Flat <floor-no>A`
- `Flat <floor-no>B`

**3 Devices for each Flat (`<flat-name>` indicate the flat name, e.g. `1A`)**

- Flat-wide Energy Meter (`energy-meter-<flat-name>`)
- Multi-Color Smart Light in Living Room (`smart-light-living-room-<flat-name>`)
- Thermostat in Bedroom (`thermostat-bedroom-<flat-name>`)

Note that all the devices mentioned above will not be simulated. You will not see any telemetry data for the devices
mentioned above in the system.

> To demonstrate the real-time data visualization and anomaly detection capability of the system, a special device, "A
> Simulated IoT Device" (`a-simulated-sensor`) is added to `Flat 1A`. This device will be powered by an IoT Device
> Simulator using IoT sensor data adopted from the [AnoML-IoT](https://www.kaggle.com/datasets/hkayan/anomliot) dataset.

**2 Users (apart from the default `Master Admin` account)**

| Username    | Password    | Full Name  | Role     | Assigned to Flat |
|-------------|-------------|------------|----------|------------------|
| `chriswong` | `chriswong` | Chris Wong | Resident | Flat 1A          |
| `johnsmith` | `johnsmith` | John Smith | Resident | Flat 1B          |

