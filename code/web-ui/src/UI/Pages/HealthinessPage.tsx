import { BasePageProps } from "./BaseProps";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TransitionGroup } from "react-transition-group";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Chip from "@mui/material/Chip";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import SyncProblemOutlinedIcon from "@mui/icons-material/SyncProblemOutlined";
import SyncDisabledOutlinedIcon from "@mui/icons-material/SyncDisabledOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import TroubleshootOutlinedIcon from "@mui/icons-material/TroubleshootOutlined";
import HealthinessCard, {
  HealthinessCardEntry,
} from "../Components/Cards/HealthinessCard";
import { useAppSelector } from "../../hooks";
import { useEffect, useState } from "react";
import { env } from "../../env";
import { Anomaly } from "../../Schemas/healthiness";
import { getDevices } from "../../Repository/ema/devices";
import Collapse from "@mui/material/Collapse";

export default function HealthinessPage(props: BasePageProps) {
  const token = useAppSelector((state) => state.auth.token);
  const connectionStatus = {
    [ReadyState.CONNECTING]: (
      <Chip
        icon={<SyncOutlinedIcon />}
        size="small"
        variant="outlined"
        color="warning"
        label="Connecting"
      />
    ),
    [ReadyState.OPEN]: (
      <Chip
        icon={<DoneOutlinedIcon />}
        size="small"
        variant="outlined"
        color="success"
        label="Connected"
      />
    ),
    [ReadyState.CLOSING]: (
      <Chip
        icon={<SyncProblemOutlinedIcon />}
        size="small"
        variant="outlined"
        color="warning"
        label="Disconnecting"
      />
    ),
    [ReadyState.CLOSED]: (
      <Chip
        icon={<SyncDisabledOutlinedIcon />}
        size="small"
        variant="outlined"
        color="error"
        label="Disconnected"
      />
    ),
    [ReadyState.UNINSTANTIATED]: (
      <Chip
        icon={<ErrorOutlineOutlinedIcon />}
        size="small"
        variant="outlined"
        color="error"
        label="Uninstantiated"
      />
    ),
  };
  const [healthinessCardMap, setHealthinessCardMap] = useState(
    new Map<string, HealthinessCardEntry>(),
  );
  const { lastJsonMessage, readyState } = useWebSocket(
    `${env.REACT_APP_DEVICE_HEALTH_SERVICE_WS_URL}/real-time?token=` + token,
  );
  const updateHealthinessCardMap = (anomalyResult: Anomaly) => {
    const newMap = new Map<string, HealthinessCardEntry>(healthinessCardMap);
    anomalyResult.data.forEach((anomalyKey) => {
      newMap
        .get(anomalyResult.deviceId)
        ?.latestValues.set(anomalyKey.key, anomalyKey.values[0].isAnomaly);
    });
    setHealthinessCardMap(newMap);
  };
  const startStream = async () => {
    try {
      props.setShowLoading(true);
      let devices = await getDevices(token);
      let newMap = new Map<string, HealthinessCardEntry>();
      devices.forEach((device) => {
        newMap.set(device.id as string, {
          id: device.id as string,
          displayName: device.display_name as string,
          description: device.description as string,
          latestValues: new Map<string, boolean>(),
        });
      });
      setHealthinessCardMap(newMap);
    } catch (e) {
      if (e instanceof Error) {
        props.createErrorSnackBar(e.message);
      }
    } finally {
      props.setShowLoading(false);
    }
  };
  useEffect(() => {
    startStream();
  }, []);
  useEffect(() => {
    lastJsonMessage && updateHealthinessCardMap(lastJsonMessage as Anomaly);
  }, [lastJsonMessage]);
  return (
    <Container>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
      >
        <TroubleshootOutlinedIcon sx={{ fontSize: 50 }} />
        <div>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontWeight: "bold" }}
              noWrap
            >
              Device Healthiness
            </Typography>{" "}
            {connectionStatus[readyState]}{" "}
          </Stack>
          <Typography variant="body1" gutterBottom>
            Monitor the healthiness of your devices using real-time anomaly
            detection.
          </Typography>
        </div>
      </Stack>
      <TransitionGroup>
        {Array.from(healthinessCardMap.values()).map((healthiness) => (
          <Collapse key={healthiness.id}>
            <HealthinessCard key={healthiness.id} healthiness={healthiness} />
          </Collapse>
        ))}
      </TransitionGroup>
    </Container>
  );
}
