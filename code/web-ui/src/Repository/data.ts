import { DateTime } from "luxon";
import { env } from "../env";
import { Telemetry } from "../Schemas/data";

export async function getHistoricalData(
  token: string,
  deviceId: string,
  fromTs: DateTime,
  toTs: DateTime,
): Promise<Telemetry> {
  const reponse = await fetch(
    env.REACT_APP_DEVICE_DATA_SERVICE_URL +
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
