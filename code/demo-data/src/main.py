import os
from collections import defaultdict

import httpx

EMA_SERVICE_URL = os.environ.get("EMA_SERVICE_URL", "http://localhost:8000")
MASTER_ADMIN_USERNAME = os.environ.get("MASTER_ADMIN_USERNAME", "admin")
MASTER_ADMIN_PASSWORD = os.environ.get("MASTER_ADMIN_PASSWORD", "password")

DEMO_FLOORS = [1, 2, 3, 4]

DEMO_FLATS = ["01", "02", "03", "04", "05"]

DEMO_DEVICES = [
    {
        "namePrefix": "intelli-thermostat-bedroom",
        "displayName": "Intelli Thermostat in Bedroom",
        "description": "Smart thermostat in Bedroom",
    },
    {
        "namePrefix": "mint-energy-meter",
        "displayName": "Mint Energy Meter",
        "description": "Energy meter for the flat",
    },
    {
        "namePrefix": "peters-hue-light-living-room",
        "displayName": "Peters Multi-Color Smart Light",
        "description": "Smart light in the living room",
    },
]

DEMO_RESIDENT_USERS = defaultdict(list)

DEMO_RESIDENT_USERS.update(
    {
        "Flat 101": [
            {
                "username": "chriswong",
                "full_name": "Chris Wong",
                "init_password": "chriswong",
                "role": "RESIDENT",
            }
        ],
        "Flat 102": [
            {
                "username": "johnsmith",
                "full_name": "John Smith",
                "init_password": "johnsmith",
                "role": "RESIDENT",
            }
        ],
    }
)

SIMULATOR_DEVICE = {
    "name": "a-multifunctional-enviro-sensor",
    "displayName": "A-Multifunctional Enviro Sensor (Simulated IoT Device)",
    "description": "Simulated IoT device in the system",
}

token_r = httpx.post(
    f"{EMA_SERVICE_URL}/auth/login",
    headers={"Content-Type": "application/x-www-form-urlencoded"},
    data={"username": MASTER_ADMIN_USERNAME, "password": MASTER_ADMIN_PASSWORD},
)

if token_r.is_error:
    print(token_r.text)
    exit(1)

token = token_r.json()["access_token"]

for floor in DEMO_FLOORS:
    r_floor = httpx.put(
        f"{EMA_SERVICE_URL}/floors",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": f"{floor}/F"},
    )
    if r_floor.is_error:
        print(r_floor.text)
        continue
    floor_id = r_floor.json()["id"]
    print(f"Floor [{floor}/F] created, id={floor_id}")
    for flat in DEMO_FLATS:
        r_flat = httpx.put(
            f"{EMA_SERVICE_URL}/flats",
            headers={"Authorization": f"Bearer {token}"},
            json={"name": f"Flat {floor}{flat}", "floor_id": floor_id},
        )
        if r_flat.is_error:
            print(r_flat.text)
            continue
        flat_id = r_flat.json()["id"]
        print(f"Flat [{floor}{flat}] created, id={flat_id}")
        for device in DEMO_DEVICES:
            r_device = httpx.put(
                f"{EMA_SERVICE_URL}/devices",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "name": f"{device['namePrefix']}-{floor}{flat}",
                    "display_name": f"{device['displayName']} in Flat {floor}{flat}",
                    "description": f"{device['description']} in Flat {floor}{flat}",
                    "flat_id": flat_id,
                },
            )
            if r_device.is_error:
                print(r_device.text)
                continue
            device_id = r_device.json()["id"]
            print(
                f"Device [{device['namePrefix']}-{floor}{flat}] created, id={device_id}"
            )
        if floor == 1 and flat == "01":
            r_simulated_device = httpx.put(
                f"{EMA_SERVICE_URL}/devices",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "name": SIMULATOR_DEVICE["name"],
                    "display_name": SIMULATOR_DEVICE["displayName"],
                    "description": SIMULATOR_DEVICE["description"],
                    "flat_id": flat_id,
                },
            )
            if r_simulated_device.is_error:
                print(r_simulated_device.text)
                continue
            simulated_device_id = r_simulated_device.json()["id"]
            print(
                f"Device [{SIMULATOR_DEVICE['name']}] created, id={simulated_device_id}"
            )

        for user in DEMO_RESIDENT_USERS[f"Flat {floor}{flat}"]:
            r_user = httpx.post(
                f"{EMA_SERVICE_URL}/users",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "username": user["username"],
                    "full_name": user["full_name"],
                    "init_password": user["init_password"],
                    "role": user["role"],
                },
            )
            if r_user.is_error:
                print(r_user.text)
                continue
            user_id = r_user.json()["id"]
            print(f"User [{user['username']}] created, id={user_id}")
            r_user_flat = httpx.post(
                f"{EMA_SERVICE_URL}/users/{user_id}/flats",
                headers={"Authorization": f"Bearer {token}"},
                json={"flat_id": flat_id},
            )
            if r_user_flat.is_error:
                print(r_user_flat.text)
                continue
            print(f"User [{user['username']}] assigned to Flat {floor}{flat}")
