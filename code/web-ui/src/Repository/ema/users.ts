import { UserCreate, UserDetail, UserUpdate } from "../../Schemas/ema";
import { env } from "../../env";
import {
  AuthenticationError,
  ResourceNotFoundError,
} from "../../UI/exceptions";

export async function getUsers(token: string): Promise<UserDetail[]> {
  const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + "/users", {
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

export async function getUser(token: string, id: string): Promise<UserDetail> {
  const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + `/users/${id}`, {
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

export async function createUser(
  token: string,
  user: UserCreate,
): Promise<void> {
  const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + `/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new AuthenticationError((await response.json())["detail"]);
  }
}

export async function updateUser(
  token: string,
  user: UserUpdate,
): Promise<void> {
  const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + `/users`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new AuthenticationError((await response.json())["detail"]);
  }
}

export async function deleteUser(token: string, id: string): Promise<void> {
  const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + `/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new AuthenticationError((await response.json())["detail"]);
  }
}

export async function addFlatToUser(
  token: string,
  userId: string,
  flatId: string,
): Promise<void> {
  const response = await fetch(
    env.REACT_APP_EMA_SERVICE_URL + `/users/${userId}/flats`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flat_id: flatId }),
    },
  );
  if (!response.ok) {
    throw new AuthenticationError((await response.json())["detail"]);
  }
}

export async function removeUserFromFlat(token: string, userId: string) {
  const response = await fetch(
    env.REACT_APP_EMA_SERVICE_URL + `/users/${userId}/flats`,
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
