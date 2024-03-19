import Card from '@mui/material/Card';
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import {useNavigate} from "react-router-dom";


export interface TelemetryCardEntry {
    id: string;
    displayName: string;
    description: string;
    latestValues: Map<string, number>;
}

function TelemetryPointDisplay(props: { telemetryKey: string, value: number }) {
    return (
        <Box sx={{padding: "10px"}}>
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                spacing={0.5}
            >
                <Typography variant="subtitle1" gutterBottom>
                    {props.telemetryKey}
                </Typography>
                <Typography variant="h4" gutterBottom>
                    {props.value}
                </Typography>
            </Stack>
        </Box>
    )
}

function TelemetryNoData() {
    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{margin: "10px"}}
        >
            <SearchOffOutlinedIcon sx={{color: "#616161"}}/>
            <Typography variant="body1" noWrap color="#616161">
                No telemetry data is present. Is the device active?
            </Typography>
        </Stack>
    )
}

export default function TelemetryCard(props: { telemetry: TelemetryCardEntry }) {
    const navigate = useNavigate();
    return (
        <Card sx={{marginBottom: "10px"}}>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={1}
                sx={{margin: "10px"}}
            >
                <MemoryOutlinedIcon sx={{fontSize: 50}}/>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{width: "100%"}}
                    spacing={0}
                >
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={0}
                    >
                        <Typography
                            variant="h6"
                            component="h6"
                            noWrap
                        >
                            {props.telemetry.displayName}
                        </Typography>
                        <Typography
                            variant="body1"
                            noWrap
                        >
                            {props.telemetry.description}
                        </Typography>
                    </Stack>
                    <Button variant="outlined" color="secondary" endIcon={<OpenInNewOutlinedIcon/>} onClick={() => {
                        navigate(`/telemetry/${props.telemetry.id}`);
                    }}>Details</Button>
                </Stack>
            </Stack>
            <Divider/>
            {props.telemetry.latestValues.size > 0 ? (
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem/>}
                    justifyContent="space-evenly"
                    alignItems="baseline"
                    spacing={0}
                >
                    {Array.from(props.telemetry.latestValues.entries()).map(([key, value]) => (
                        <TelemetryPointDisplay key={key} telemetryKey={key} value={value}/>
                    ))}
                </Stack>) : (
                <TelemetryNoData/>
            )}

        </Card>
    )
}