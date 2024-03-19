import { BasePageProps } from "./BaseProps";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { getHistoricalData } from "../../Repository/data";
import { useAppSelector } from "../../hooks";
import { Device } from "../../Schemas/ema";
import { getDevice } from "../../Repository/ema/devices";
import { Telemetry, TelemetryKey } from "../../Schemas/data";

function TelemetryKeyChartPaper(props: { telemetryKeyData: TelemetryKey }) {
  return (
    <Paper variant="outlined" sx={{ padding: "10px" }}>
      <Typography variant="h6" textAlign="center" gutterBottom>
        {props.telemetryKeyData.key}
      </Typography>
      <Line
        data={{
          labels: props.telemetryKeyData.values.map((v) => v.timestamp),
          datasets: [
            {
              label: props.telemetryKeyData.key,
              data: props.telemetryKeyData.values.map((v) => v.value),
              fill: true,
              tension: 0,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </Paper>
  );
}

export default function TelemetryDetailPage(props: BasePageProps) {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  let { id } = useParams();
  let [device, setDevice] = useState(null as Device | null);
  let [telemetryData, setTelemetryData] = useState(null as Telemetry | null);
  const [queryFromTs, setQueryFromTs] = useState(
    DateTime.now().minus({ minute: 5 }).toISO().slice(0, 16),
  );
  const [queryToTs, setQueryToTs] = useState(
    DateTime.now().toISO().slice(0, 16),
  );
  const queryData = async () => {
    try {
      if (id === undefined) {
        return navigate("/telemetry");
      }
      props.setShowLoading(true);
      let dtObjFromTs = DateTime.fromISO(queryFromTs);
      let dtObjToTs = DateTime.fromISO(queryToTs);
      let currentDevice = await getDevice(token, id);
      let result = await getHistoricalData(token, id, dtObjFromTs, dtObjToTs);
      setDevice(currentDevice);
      setTelemetryData(result);
    } catch (e) {
      if (e instanceof Error) {
        props.createErrorSnackBar(e.message);
      }
    } finally {
      props.setShowLoading(false);
    }
  };
  useEffect(() => {
    queryData();
  }, []);
  return (
    <Container>
      <Button
        size="large"
        startIcon={<ArrowBackOutlinedIcon />}
        color="secondary"
        onClick={() => {
          navigate("/telemetry");
        }}
      >
        Back to List
      </Button>

      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        spacing={2}
      >
        <Card sx={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
          >
            <MemoryOutlinedIcon sx={{ fontSize: 50 }} />
            <div>
              <Typography
                component="h1"
                variant="h5"
                sx={{ fontWeight: "bold" }}
                noWrap
              >
                {device?.display_name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Historical telemetry data from IoT device
              </Typography>
            </div>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3}
          >
            <Typography component="div" variant="body1" noWrap>
              From
            </Typography>
            <TextField
              variant="standard"
              type="datetime-local"
              value={queryFromTs}
              onChange={(e) => {
                setQueryFromTs(e.target.value);
              }}
            />
            <Typography component="div" variant="body1" noWrap>
              to
            </Typography>
            <TextField
              variant="standard"
              type="datetime-local"
              value={queryToTs}
              onChange={(e) => {
                setQueryToTs(e.target.value);
              }}
            />
            <Button
              variant="contained"
              startIcon={<SearchOutlinedIcon />}
              onClick={queryData}
            >
              Query
            </Button>
          </Stack>
        </Card>
        {telemetryData?.data.map((telemetryKey) => (
          <TelemetryKeyChartPaper
            key={telemetryKey.key}
            telemetryKeyData={telemetryKey}
          />
        ))}
      </Stack>
    </Container>
  );
}
