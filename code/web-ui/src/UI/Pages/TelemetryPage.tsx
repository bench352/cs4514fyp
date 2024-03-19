import Container from '@mui/material/Container';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import TelemetryCard, {TelemetryCardEntry} from "../Components/Cards/TelemetryCard";
import {useEffect, useState} from "react";
import {useAppSelector} from "../../hooks";
import {getDevices} from "../../Repository/ema/devices";
import {Telemetry} from "../../Schemas/data";
import {BasePageProps} from "./BaseProps";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {env} from "../../env";
import Chip from '@mui/material/Chip';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import SyncProblemOutlinedIcon from '@mui/icons-material/SyncProblemOutlined';
import SyncDisabledOutlinedIcon from '@mui/icons-material/SyncDisabledOutlined';
import {TransitionGroup} from 'react-transition-group';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import Collapse from '@mui/material/Collapse';


export default function TelemetryPage(props: BasePageProps) {
    const connectionStatus = {
        [ReadyState.CONNECTING]: <Chip icon={<SyncOutlinedIcon/>} size="small" variant="outlined" color="warning" label="Connecting"/>,
        [ReadyState.OPEN]: <Chip icon={<DoneOutlinedIcon/>} size="small" variant="outlined" color="success" label="Connected"/>,
        [ReadyState.CLOSING]: <Chip icon={<SyncProblemOutlinedIcon/>} size="small" variant="outlined" color="warning" label="Disconnecting"/>,
        [ReadyState.CLOSED]: <Chip icon={<SyncDisabledOutlinedIcon/>} size="small" variant="outlined" color="error" label="Disconnected"/>,
        [ReadyState.UNINSTANTIATED]: <Chip icon={<ErrorOutlineOutlinedIcon/>} size="small" variant="outlined" color="error"
                                           label="Uninstantiated"/>,
    };

    const token = useAppSelector((state) => state.auth.token);
    const [telemetryCardMap, setTelemetryCardMap] = useState(new Map<string, TelemetryCardEntry>());
    const {
        lastJsonMessage,
        readyState,
    } = useWebSocket(env.REACT_APP_DEVICE_DATA_SERVICE_WS_URL + "/real-time?token=" + token);
    const updateTelemetryCardMap = (telemetry: Telemetry) => {
        const newMap = new Map<string, TelemetryCardEntry>(telemetryCardMap);
        telemetry.data.forEach(telemetryKey => {
            newMap.get(telemetry.deviceId)?.latestValues.set(telemetryKey.key, telemetryKey.values[0].value);
        })

        setTelemetryCardMap(newMap);
    }
    const startStream = async () => {
        try {
            props.setShowLoading(true);
            let devices = await getDevices(token);
            let newMap = new Map<string, TelemetryCardEntry>();
            devices.forEach(device => {
                newMap.set(device.id as string, {
                    id: device.id as string,
                    displayName: device.display_name as string,
                    description: device.description as string,
                    latestValues: new Map<string, number>()
                });
            });
            setTelemetryCardMap(newMap);
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    }
    useEffect(() => {
        startStream();
    }, []);
    useEffect(() => {
        lastJsonMessage && updateTelemetryCardMap(lastJsonMessage as Telemetry);
    }, [lastJsonMessage]);
    return (
        <Container>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
            >
                <TimelineOutlinedIcon sx={{fontSize: 50}}/>
                <div>
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={2}
                    >
                        <Typography component="h1" variant="h5" sx={{fontWeight: "bold"}} noWrap>
                            Telemetry Data
                        </Typography> {connectionStatus[readyState]} </Stack>
                    <Typography variant="body1" gutterBottom>
                        Access real-time data from IoT devices.
                    </Typography></div>

            </Stack>
            <TransitionGroup>
                {Array.from(telemetryCardMap.values()).map((telemetryCard) => (
                    <Collapse key={telemetryCard.id}>
                    <TelemetryCard key={telemetryCard.id} telemetry={telemetryCard}/>
                    </Collapse>
                ))}
            </TransitionGroup>
        </Container>
    );
}