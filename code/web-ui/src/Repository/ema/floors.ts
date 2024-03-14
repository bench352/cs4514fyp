import {Floor} from "../../Schemas/ema";
import {env} from "../../env";
import {AuthenticationError, ResourceNotFoundError} from "../../UI/exceptions";

export async function getFloors(token: string): Promise<Floor[]> {
    const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + "/floors", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    if (!response.ok) {
        throw new AuthenticationError((await response.json())["detail"])
    }
    return await response.json()
}

export async function getFloor(token: string, id: string): Promise<Floor> {
    const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + `/floors/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
    if (response.status === 404) {
        throw new ResourceNotFoundError((await response.json())["detail"])
    } else if (!response.ok) {
        throw new AuthenticationError((await response.json())["detail"])
    }
    return await response.json()
}

export async function upsertFloor(token:string, floor: Floor): Promise<void> {
    const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + `/floors`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(floor)
    })
    if (!response.ok) {
        throw new AuthenticationError((await response.json())["detail"])
    }
}

export async function deleteFloor(token: string, id: string): Promise<void> {
    const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + `/floors/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
    if (!response.ok) {
        throw new AuthenticationError((await response.json())["detail"])
    }
}