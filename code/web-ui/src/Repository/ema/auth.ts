import {env} from "../../env";
import {AuthenticationError} from "../../UI/exceptions";
import {UserDetail} from "../../Schemas/ema";

export default class Auth {
    async login(username: string, password: string): Promise<string> {
        const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username: username,
                password: password
            })
        })
        if (!response.ok) {
            throw new AuthenticationError((await response.json())["detail"])
        }
        return (await response.json())["access_token"]
    }

    async getUserProfile(token: string): Promise<UserDetail> {
        const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + "/auth/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new AuthenticationError((await response.json())["detail"])
        }
        return await response.json()
    }

    async changePassword(token: string, oldPassword: string, newPassword: string): Promise<void> {
        const response = await fetch(env.REACT_APP_EMA_SERVICE_URL + "/auth/password", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                current_password: oldPassword,
                new_password: newPassword
            }),
        })
        if (!response.ok) {
            throw new AuthenticationError((await response.json())["detail"])
        }
    }
}