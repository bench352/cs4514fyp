import {UserDetail} from "../../Schemas/ema";
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined';
import Container from "@mui/material/Container";
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';

function AdminHomePage(props: { userDetail: UserDetail }) {
    return (
        <>
            <Typography variant="h5">
                Greetings, {props.userDetail.full_name}! Welcome to
            </Typography>
            <Typography variant="h3" gutterBottom fontWeight="bold">
                Smart Home Management System
            </Typography>
            <Typography variant="body1" gutterBottom>
                Smart Home Management System offers a suite of tools for managing and monitoring entities in
                your
                buildings more easily. Here are what you can do in the system:
            </Typography>
            <List>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <HomeWorkOutlinedIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Entity Management"
                                  secondary="Manage the entities in your apartment building in terms of floors, flats, devices and the relationship between them."/>
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <PeopleOutlineOutlinedIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="User Management"
                                  secondary="You can invite other trusted users to join the system and manage entities in your building by creating a Landlord account for them. In addition, your residents can enjoy the convenience of an IoT-powered residence too, but here's the catch - they have read-only access to what's within their flat only, and you have total control of it."/>
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <TimelineOutlinedIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Real-time Telemetry Data"
                                  secondary="Always be informed of what's happening in your building by watching the real-time telemetry data produced by the IoT devices."/>
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <TroubleshootOutlinedIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Real-time Anomaly Detection"
                                  secondary="Smart Home Management System continuously tracks your IoT devices and performs anomaly detection on your device data as soon as they arrive, letting you instantly check the healthiness status of your devices in the system."/>
                </ListItem>
            </List>

        </>
    );

}

function ResidentHomePage(props: { userDetail: UserDetail }) {
    return (
        <>
            <Typography variant="h5">
                Greetings, {props.userDetail.full_name}! Welcome to
            </Typography>
            <Typography variant="h3" gutterBottom fontWeight="bold">
                {props.userDetail.flat ? props.userDetail.flat.name : "Smart Home Management System"}
            </Typography>
            {props.userDetail.flat === null ? (
                <Alert variant="filled" severity="warning">
                    <AlertTitle>Attention: Your account has not been assigned to a flat yet!</AlertTitle>
                    Your access to the system is not available until your landlord assigns your account to a specific
                    flat. Please reach out to your landlord for further assistance.
                </Alert>
            ) : <>
                <Typography variant="body1" gutterBottom>
                    As a resident, you can enjoy the convenience of an IoT-powered residence and access all IoT devices
                    within your apartment unit using the Smart Home Management System. Here are what you can do in the
                    system:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <TimelineOutlinedIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Real-time Telemetry Data"
                                      secondary="Check what's going on in your apartment unit by checking the telemetry data from your IoT devices in real-time."/>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <TroubleshootOutlinedIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Real-time Anomaly Detection"
                                      secondary="Smart Home Management System continuously tracks your IoT devices and performs anomaly detection on your device data as soon as they arrive, letting you instantly check the healthiness status of your devices in the system."/>
                    </ListItem>
                </List>
                <Typography variant="body1" gutterBottom>
                    As a resident, you have limited access to the system - you can only view IoT device data that
                    belongs to your apartment unit, but not everything else. If you need to update information on your
                    devices or your account, or if you need elevated permission, please contact your landlord for
                    assistance.
                </Typography>
            </>}
        </>);
}


export default function HomePage(props: { userDetail: UserDetail | null }) {
    if (props.userDetail === null) {
        return <></>
    }
    return (
        <Container>
            {props.userDetail.role === "LANDLORD" ? (
                    <AdminHomePage userDetail={props.userDetail}/>
                )
                :
                (
                    <ResidentHomePage userDetail={props.userDetail}/>
                )
            }
        </Container>
    )
        ;
}