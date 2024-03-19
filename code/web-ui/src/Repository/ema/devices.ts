import { env } from "../../env";
import {
  AuthenticationError,
  ResourceNotFoundError,
} from "../../UI/exceptions";
import { Device } from "../../Schemas/ema";

export async function getDevices(token: string): Promise<Device[]> {
  const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + "/devices", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new AuthenticationError((await response.json())["detail"]);
  }
  return await response.json();
}

export async function getDevice(token: string, id: string): Promise<Device> {
  const response = await fetch(
    env.REACT_APP_EMA_SERVICE_URL + `/devices/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (response.status === 404) {
    throw new ResourceNotFoundError((await response.json())["detail"]);
  } else if (!response.ok) {
    throw new AuthenticationError((await response.json())["detail"]);
  }
  return await response.json();
}

export async function upsertDevice(
  token: string,
  device: Device,
): Promise<void> {
  const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + `/devices`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(device),
  });
  if (!response.ok) {
    throw new AuthenticationError((await response.json())["detail"]);
  }
}

export async function deleteDevice(token: string, id: string): Promise<void> {
  const response = await fetch(
    env.REACT_APP_EMA_SERVICE_URL + `/devices/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new AuthenticationError((await response.json())["detail"]);
  }
}
