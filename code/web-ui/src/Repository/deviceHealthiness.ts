import { env } from "../env";
import { DateTime } from "luxon";
import { Anomaly } from "../Schemas/healthiness";

export async function getHistoricalAnomalyDetectionResult(
  token: string,
  deviceId: string,
  fromTs: DateTime,
  toTs: DateTime,
): Promise<Anomaly> {
  const reponse = await fetch(
    env.REACT_APP_DEVICE_HEALTH_SERVICE_URL +
      `/devices/${deviceId}/historical?` +
      new URLSearchParams({
        from_ts: fromTs.toISO() as string,
        to_ts: toTs.toISO() as string,
      }),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!reponse.ok) {
    throw new Error((await reponse.json())["detail"]);
  }
  return await reponse.json();
}
