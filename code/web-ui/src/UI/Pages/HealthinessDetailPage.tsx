import { BasePageProps } from "./BaseProps";
import "chart.js/auto";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Paper from "@mui/material/Paper";
import { Chart } from "react-chartjs-2";
import { DateTime } from "luxon";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Device } from "../../Schemas/ema";
import { getDevice } from "../../Repository/ema/devices";
import { useAppSelector } from "../../hooks";
import { getHistoricalAnomalyDetectionResult } from "../../Repository/deviceHealthiness";
import { getHistoricalData } from "../../Repository/data";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";

interface AnomalyValues {
  timestamp: string;
  value: number;
  isAnomaly: boolean;
}

interface AnomalyResultPresentation {
  key: string;
  values: AnomalyValues[];
}

function AnomalyKeyChartPaper(props: {
  anomalyResultPresentation: AnomalyResultPresentation;
}) {
  return (
    <Paper variant="outlined" sx={{ padding: "10px" }}>
      <Typography variant="h6" textAlign="center" gutterBottom>
        {props.anomalyResultPresentation.key}
      </Typography>
      <Chart
        type="scatter"
        data={{
          labels: props.anomalyResultPresentation.values.map((v) =>
            DateTime.fromISO(v.timestamp, { zone: "UTC" })
              .toLocal()
              .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS),
          ),
          datasets: [
            {
              label: props.anomalyResultPresentation.key,
              data: props.anomalyResultPresentation.values.map((v) => v.value),
              type: "line",
              fill: true,
              order: 2,
            },
            {
              label: "Anomaly",
              type: "scatter",
              data: props.anomalyResultPresentation.values.map((v) => v.value),
              pointRadius: props.anomalyResultPresentation.values.map((v) =>
                v.isAnomaly ? 5 : 0,
              ),
              pointBackgroundColor: "red",
              order: 1,
            },
          ],
        }}
      />
    </Paper>
  );
}

export default function HealthinessDetailPage(props: BasePageProps) {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  let { id } = useParams();
  let [device, setDevice] = useState(null as Device | null);
  let [resultPresentation, setResultPresentation] = useState(
    [] as AnomalyResultPresentation[],
  );
  const [queryFromTs, setQueryFromTs] = useState(
    DateTime.now().minus({ minute: 30 }).toISO().slice(0, 16),
  );
  const [queryToTs, setQueryToTs] = useState(
    DateTime.now().toISO().slice(0, 16),
  );
  const queryData = async () => {
    try {
      if (id === undefined) {
        return navigate("/healthiness");
      }
      props.setShowLoading(true);
      let dtObjFromTs = DateTime.fromISO(queryFromTs, { zone: "local" });
      let dtObjToTs = DateTime.fromISO(queryToTs, { zone: "local" });
      let currentDevice = await getDevice(token, id);
      let telemetryResult = await getHistoricalData(
        token,
        id,
        dtObjFromTs,
        dtObjToTs,
      );
      let anomalyResult = await getHistoricalAnomalyDetectionResult(
        token,
        id,
        dtObjFromTs,
        dtObjToTs,
      );
      setDevice(currentDevice);
      let resultPresentation: AnomalyResultPresentation[] = [];
      telemetryResult.data.forEach((telemetryKey) => {
        let anomalyKey = anomalyResult.data.find(
          (anomaly) => anomaly.key === telemetryKey.key,
        );
        let anomalyValues: AnomalyValues[] = [];
        telemetryKey.values.forEach((telemetryDataPoint) => {
          let anomalyValue = anomalyKey?.values.find(
            (anomalyDataPoint) =>
              anomalyDataPoint.timestamp === telemetryDataPoint.timestamp,
          );
          if (anomalyValue) {
            anomalyValues.push({
              timestamp: telemetryDataPoint.timestamp,
              value: telemetryDataPoint.value,
              isAnomaly: anomalyValue.isAnomaly,
            });
          }
        });
        resultPresentation.push({
          key: telemetryKey.key,
          values: anomalyValues,
        });
      });
      setResultPresentation(resultPresentation);
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
          navigate("/healthiness");
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
                Historical anomaly detection results for IoT device
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
        {resultPresentation.map((result) => (
          <AnomalyKeyChartPaper
            key={result.key}
            anomalyResultPresentation={result}
          />
        ))}
        {resultPresentation.length === 0 ? (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ margin: "10px" }}
          >
            <SearchOffOutlinedIcon sx={{ color: "#616161" }} />
            <Typography variant="body1" noWrap color="#616161">
              No anomaly detection results in the selected time range.
            </Typography>
          </Stack>
        ) : (
          ""
        )}
      </Stack>
    </Container>
  );
}
