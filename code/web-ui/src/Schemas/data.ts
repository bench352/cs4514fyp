export interface TelemetryDataPoint {
    timestamp: string;
    value: number;
}

export interface TelemetryKey {
    key: string;
    values: TelemetryDataPoint[];
}

export interface Telemetry {
    deviceId: string;
    data: TelemetryKey[];
}