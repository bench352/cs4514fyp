// Adopted from https://mui.com/material-ui/react-drawer/#responsive-drawer
// Customized for the purpose of the project

import * as React from 'react';
import {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import MenuIcon from '@mui/icons-material/Menu';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import Toolbar from '@mui/material/Toolbar';
import {Route, Routes, useNavigate} from "react-router-dom";
import Typography from '@mui/material/Typography';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import HomePage from "./Pages/HomePage";
import ListSubheader from '@mui/material/ListSubheader';
import FloorsPage from "./Pages/EntityManagement/FloorsPage";
import CurrentUserDialog from "./Components/Dialogs/CurrentUserDialog";
import Fade from '@mui/material/Fade';
import FlatsPage from "./Pages/EntityManagement/FlatsPage";
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import DevicesPage from "./Pages/EntityManagement/DevicesPage";
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import UsersPage from "./Pages/EntityManagement/UsersPage";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import TelemetryPage from "./Pages/TelemetryPage";
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined';
import TelemetryDetailPage from "./Pages/TelemetryDetailPage";
import HealthinessPage from "./Pages/HealthinessPage";
import HealthinessDetailPage from "./Pages/HealthinessDetailPage";
import {UserDetail} from "../Schemas/ema";
import Auth from "../Repository/ema/auth";
import {useAppSelector} from "../hooks";
import APIDocsPage from "./Pages/APIDocsPage";

const drawerWidth = 240;
const emaService = new Auth();

const entityManagementItems = [
    {
        name: "Floors",
        icon: <ApartmentOutlinedIcon/>,
        link: "/floors",
    },
    {
        name: "Flats",
        icon: <MeetingRoomOutlinedIcon/>,
        link: "/flats",
    },
    {
        name: "Devices",
        icon: <MemoryOutlinedIcon/>,
        link: "/devices",
    }, {
        name: "Users",
        icon: <GroupOutlinedIcon/>,
        link: "/users"
    }
]

const telemetryItems = [
    {
        name: "Telemetry Data",
        icon: <TimelineOutlinedIcon/>,
        link: "/telemetry",
    },
    {
        name: "Device Healthiness",
        icon: <TroubleshootOutlinedIcon/>,
        link: "/healthiness",
    },

]

export default function UIContainer() {
    const navigate = useNavigate();
    const token = useAppSelector((state) => state.auth.token);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [showLoading, setShowLoading] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState("");
    const [showSnackBar, setShowSnackBar] = React.useState(false);
    const [showCurrentUserDialog, setShowCurrentUserDialog] = React.useState(false);
    const [userDetail, setUserDetail] = useState(null as UserDetail | null);
    const loadUser = async () => {
        try {
            setShowLoading(true);
            let currentUser = await emaService.getUserProfile(token);
            setUserDetail(currentUser);
        } catch (e) {
            if (e instanceof Error) {
                createErrorSnackBar(e.message);
            }
        } finally {
            setShowLoading(false);
        }
    }
    const createErrorSnackBar = (message: string) => {
        setSnackBarMessage(message);
        setShowSnackBar(true);
    }
    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <div>
            <Toolbar/>
            <Divider/>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate("/")
                    }}>
                        <ListItemIcon>
                            <HomeOutlinedIcon/>,
                        </ListItemIcon>
                        <ListItemText primary="Home"/>
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider/>
            {userDetail?.role === "LANDLORD" ?
                (<>
                    <List subheader={
                        <ListSubheader component="div">
                            Entity Management
                        </ListSubheader>
                    }>
                        {entityManagementItems.map((option) => (
                            <ListItem key={option.name} disablePadding>
                                <ListItemButton onClick={() => {
                                    navigate(option.link)
                                }}>
                                    <ListItemIcon>
                                        {option.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={option.name}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                </>)
                : ""}
            <List subheader={
                <ListSubheader component="div">
                    Real-time Monitoring
                </ListSubheader>
            }>
                {telemetryItems.map((option) => (
                    <ListItem key={option.name} disablePadding>
                        <ListItemButton onClick={() => {
                            navigate(option.link)
                        }}>
                            <ListItemIcon>
                                {option.icon}
                            </ListItemIcon>
                            <ListItemText primary={option.name}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        setShowCurrentUserDialog(true);
                    }}>
                        <ListItemIcon>
                            <AccountCircleOutlinedIcon/>,
                        </ListItemIcon>
                        <ListItemText primary="Your Account"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate("/apidocs");
                    }}>
                        <ListItemIcon>
                            <CodeOutlinedIcon/>,
                        </ListItemIcon>
                        <ListItemText primary="API Docs"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );
    useEffect(() => {
        loadUser();
    }, []);
    return (
        <Box sx={{display: 'flex'}}>
            <Snackbar open={showSnackBar} autoHideDuration={6000} onClose={() => setShowSnackBar(false)}>
                <Alert onClose={() => setShowSnackBar(false)} severity="error" sx={{width: '100%'}}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>

            <CssBaseline/>
            <AppBar
                position="fixed"
                sx={{
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `${drawerWidth}px`},
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Smart Home Management System
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
            >
                <Toolbar/>
                <Routes>
                    <Route index path="/" element={<HomePage userDetail={userDetail}/>}/>
                    <Route path="floors">
                        <Route path=":id"
                               element={<FloorsPage setShowLoading={setShowLoading}
                                                    createErrorSnackBar={createErrorSnackBar}/>}/>
                        <Route path=""
                               element={<FloorsPage setShowLoading={setShowLoading}
                                                    createErrorSnackBar={createErrorSnackBar}/>}/>
                    </Route>
                    <Route path="flats">
                        <Route path=":id" element={
                            <FlatsPage setShowLoading={setShowLoading} createErrorSnackBar={createErrorSnackBar}/>}/>
                        <Route path="" element={
                            <FlatsPage setShowLoading={setShowLoading} createErrorSnackBar={createErrorSnackBar}/>}/>
                    </Route>
                    <Route path="devices">
                        <Route path=":id" element={<DevicesPage setShowLoading={setShowLoading}
                                                                createErrorSnackBar={createErrorSnackBar}/>}/>
                        <Route path="" element={<DevicesPage setShowLoading={setShowLoading}
                                                             createErrorSnackBar={createErrorSnackBar}/>}/>
                    </Route>
                    <Route path="users">
                        <Route path=":id" element={<UsersPage setShowLoading={setShowLoading}
                                                              createErrorSnackBar={createErrorSnackBar}/>}/>
                        <Route path="" element={<UsersPage setShowLoading={setShowLoading}
                                                           createErrorSnackBar={createErrorSnackBar}/>}/>
                    </Route>
                    <Route path="telemetry">
                        <Route path="" element={<TelemetryPage setShowLoading={setShowLoading}
                                                               createErrorSnackBar={createErrorSnackBar}/>}/>
                        <Route path=":id" element={<TelemetryDetailPage setShowLoading={setShowLoading}
                                                                        createErrorSnackBar={createErrorSnackBar}/>}/>
                    </Route>
                    <Route path="healthiness">
                        <Route path="" element={<HealthinessPage setShowLoading={setShowLoading}
                                                                 createErrorSnackBar={createErrorSnackBar}/>}/>
                        <Route path=":id" element={<HealthinessDetailPage createErrorSnackBar={createErrorSnackBar}
                                                                          setShowLoading={setShowLoading}/>}/>
                    </Route>
                    <Route path="apidocs" element={<APIDocsPage/>}/>
                </Routes>
            </Box>
            <Snackbar
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                open={showLoading}
                TransitionComponent={Fade}
            >
                <Paper elevation={4} sx={{backgroundColor: "#212121"}}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                        sx={{margin: "10px"}}
                    >
                        <CircularProgress size={20}/>
                        <Typography variant="body2" component="div" color="#ffffff">
                            Just a moment...
                        </Typography>
                    </Stack>
                </Paper>


            </Snackbar>
            <CurrentUserDialog setShowDialog={setShowCurrentUserDialog} createErrorSnackBar={createErrorSnackBar}
                               setShowLoading={setShowLoading} open={showCurrentUserDialog} userDetail={userDetail}/>
        </Box>
    );
}
