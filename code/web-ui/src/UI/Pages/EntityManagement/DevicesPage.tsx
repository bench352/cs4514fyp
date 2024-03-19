import {BasePageProps} from "../BaseProps";
import {useAppSelector} from "../../../hooks";
import * as React from "react";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {TransitionGroup} from "react-transition-group";
import Zoom from '@mui/material/Zoom';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import {Flat} from "../../../Schemas/ema";
import {getDevices} from "../../../Repository/ema/devices";
import {getFlats} from "../../../Repository/ema/flats";
import Collapse from "@mui/material/Collapse";
import DeviceCard from "../../Components/Cards/DeviceCard";
import UpdateDeviceDialog from "../../Components/Dialogs/EntityManagement/UpdateDeviceDialog";
import AddDeviceDialog from "../../Components/Dialogs/EntityManagement/AddDeviceDialog";

const floatingButtonStyle = {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
};

export interface DeviceRepresentation {
    id: string;
    name: string;
    displayName: string;
    flatName: string;
}

export default function DevicesPage(props: BasePageProps) {
    const token = useAppSelector((state) => state.auth.token);
    const [showAddDialog, setShowAddDialog] = useState(false);
    let {id} = useParams();
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [flats, setFlats] = useState([] as Flat[]);
    const [devices, setDevices] = useState([] as DeviceRepresentation[]);
    const refreshDevices = async () => {
        try {
            props.setShowLoading(true);
            let allDevices = await getDevices(token);
            let allFlats = await getFlats(token);
            let devicePres: DeviceRepresentation[] = [];
            allDevices.forEach(device => {
                let flat = allFlats.find(flat => flat.id === device.flat_id);
                devicePres.push({
                    id: device.id ?? "",
                    name: device.name,
                    displayName: device.display_name,
                    flatName: flat ? flat.name : ""
                });
            });
            setDevices(devicePres);
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    }

    useEffect(() => {
        setShowUpdateDialog(id !== undefined);
    }, [id]);
    useEffect(() => {
        refreshDevices()
    }, [id, showAddDialog]);
    return (
        <Container>
            <Zoom in={true}>
                <Fab sx={floatingButtonStyle} variant="extended" onClick={() => {
                    setShowAddDialog(true);
                }}>
                    <AddOutlinedIcon sx={{mr: 1}}/>
                    Add Device
                </Fab>
            </Zoom>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
            >
                <MemoryOutlinedIcon sx={{fontSize: 50}}/>
                <div><Typography component="h1" variant="h5" sx={{fontWeight: "bold"}} noWrap>
                    Devices
                </Typography>
                    <Typography variant="body1" gutterBottom>
                        IoT devices and smart sensors in your building.
                    </Typography></div>

            </Stack>
            <TransitionGroup>
                {devices.map(device => (
                    <Collapse key={device.id}><DeviceCard key={device.id} device={device}/></Collapse>))}
            </TransitionGroup>
            <UpdateDeviceDialog open={showUpdateDialog} entityId={id} setShowLoading={props.setShowLoading}
                                createErrorSnackBar={props.createErrorSnackBar}/>
            <AddDeviceDialog open={showAddDialog} setShowDialog={setShowAddDialog} setShowLoading={props.setShowLoading}
                             createErrorSnackBar={props.createErrorSnackBar}/>
        </Container>
    );
}