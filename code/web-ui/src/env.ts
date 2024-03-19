declare global {
    interface Window {
        env: any
    }
}

type EnvType = {
    REACT_APP_EMA_SERVICE_URL: string,
    REACT_APP_DEVICE_DATA_SERVICE_URL: string,
    REACT_APP_DEVICE_DATA_SERVICE_WS_URL: string,
    REACT_APP_DEVICE_HEALTH_SERVICE_URL: string,
    REACT_APP_DEVICE_HEALTH_SERVICE_WS_URL: string,
}

export const env: EnvType = {
    ...process.env, ...window.env
}