export interface AnomalyDataPoint {
  timestamp: string;
  isAnomaly: boolean;
}

export interface AnomalyKey {
  key: string;
  values: AnomalyDataPoint[];
}

export interface Anomaly {
  deviceId: string;
  data: AnomalyKey[];
}
