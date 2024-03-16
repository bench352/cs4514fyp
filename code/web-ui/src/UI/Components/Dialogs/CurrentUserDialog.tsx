import Auth from "../../../Repository/ema/auth";
import {AddAssetDialogProps} from "../../Pages/BaseProps";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {UserProfile} from "../../../Schemas/ema";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import Dialog from "@mui/material/Dialog";
import Avatar from '@mui/material/Avatar';
import {useEffect, useState} from "react";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import {useNavigate} from "react-router-dom";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import ChangePasswordDialog from "./ChangePasswordDialog";

const emaService = new Auth();


export default function CurrentUserDialog(props: AddAssetDialogProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const token = useAppSelector((state) => state.auth.token);
    const [userProfile, setUserProfile] = useState(null as UserProfile | null);
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
    const loadUser = async () => {
        try {
            props.setShowLoading(true);
            let currentUser = await emaService.getUserProfile(token);
            setUserProfile(currentUser);
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    }
    const logout = async () => {
        dispatch({type: 'auth/logout'});
        navigate("/login");
    }
    useEffect(() => {
        loadUser();
    }, []);
    return (
        <Dialog open={props.open} fullWidth maxWidth="xs">
            <DialogTitle>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                >
                    <Avatar>
                        <PersonOutlineOutlinedIcon/>
                    </Avatar>
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={0}
                    >
                        <Typography variant="body1" component="div" sx={{fontWeight: "bold"}}>
                            {userProfile?.full_name}
                        </Typography>
                        <Typography variant="caption" component="div">
                            @{userProfile?.username}
                        </Typography>
                    </Stack>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <List>
                    <ListItem disablePadding>

                        <ListItemIcon>
                            <WorkspacePremiumOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Role" secondary={userProfile?.role}/>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton disableGutters={true} onClick={() => {
                            setShowChangePasswordDialog(true)
                        }}>
                            <ListItemIcon>
                                <KeyOutlinedIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Change Password"/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2} width={"100%"}
                >
                    <Tooltip title="Back">
                        <IconButton aria-label="back" size="large" onClick={() => {
                            props.setShowDialog(false);
                        }}>
                            <ArrowBackOutlinedIcon fontSize="inherit"/>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Logout">
                        <IconButton aria-label="save" size="large" onClick={logout}>
                            <LogoutOutlinedIcon fontSize="inherit"/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </DialogActions>
            <ChangePasswordDialog open={showChangePasswordDialog} setShowDialog={setShowChangePasswordDialog}
                                  setShowLoading={props.setShowLoading} createSnackBar={props.createErrorSnackBar}/>
        </Dialog>
    );
}