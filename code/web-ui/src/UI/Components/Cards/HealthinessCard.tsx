import Stack from "@mui/material/Stack";
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import Box from "@mui/material/Box";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {useNavigate} from "react-router-dom";

export interface HealthinessCardEntry {
    id: string;
    displayName: string;
    description: string;
    latestValues: Map<string, boolean>;
}

function HealthinessPointDisplay(props: { telemetryKey: string, isAnomaly: boolean }) {
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
                    {props.isAnomaly ? <WarningAmberIcon sx={{color: "#f57f17", fontSize: "40px"}}/> :
                        <CheckCircleOutlineOutlinedIcon sx={{color: "#4caf50", fontSize: "40px"}}/>
                    }
                </Typography>
            </Stack>
        </Box>
    )
}

function AnomalyNoData() {
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
                No anomaly detection results are present. Is the device active?
            </Typography>
        </Stack>
    )
}

export default function HealthinessCard(props: { healthiness: HealthinessCardEntry }) {
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
                            {props.healthiness.displayName}
                        </Typography>
                        <Typography
                            variant="body1"
                            noWrap
                        >
                            {props.healthiness.description}
                        </Typography>
                    </Stack>
                    <Button variant="outlined" color="secondary" endIcon={<OpenInNewOutlinedIcon/>} onClick={() => {
                        navigate("/healthiness/" + props.healthiness.id);
                    }}>Details</Button>
                </Stack>
            </Stack>
            <Divider/>
            {props.healthiness.latestValues.size > 0 ? (
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem/>}
                    justifyContent="space-evenly"
                    alignItems="baseline"
                    spacing={0}
                >
                    {Array.from(props.healthiness.latestValues.entries()).map(([key, value]) => (
                        <HealthinessPointDisplay key={key} telemetryKey={key} isAnomaly={value}/>
                    ))}

                </Stack>) : (
                <AnomalyNoData/>
            )}

        </Card>
    )
}