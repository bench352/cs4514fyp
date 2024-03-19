import { Flat } from "../../Schemas/ema";
import { env } from "../../env";
import {
  AuthenticationError,
  ResourceNotFoundError,
} from "../../UI/exceptions";

export async function getFlats(token: string): Promise<Flat[]> {
  const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + "/flats", {
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

export async function getFlat(token: string, id: string): Promise<Flat> {
  const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + `/flats/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 404) {
    throw new ResourceNotFoundError((await response.json())["detail"]);
  } else if (!response.ok) {
    throw new AuthenticationError((await response.json())["detail"]);
  }
  return await response.json();
}

export async function upsertFlat(token: string, flat: Flat): Promise<void> {
  const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + `/flats`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(flat),
  });
  if (!response.ok) {
    throw new AuthenticationError((await response.json())["detail"]);
  }
}

export async function deleteFlat(token: string, id: string): Promise<void> {
  const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + `/flats/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new AuthenticationError((await response.json())["detail"]);
  }
}
