import {BasePageProps} from "./BaseProps";
import {useAppSelector} from "../../hooks";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Container from "@mui/material/Container";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import {TransitionGroup} from "react-transition-group";
import {UserDetail} from "../../Schemas/ema";
import {getUsers} from "../../Repository/ema/users";
import UserCard from "../Components/Cards/UserCard";
import Collapse from '@mui/material/Collapse';
import UpdateUserDialog from "../Components/Dialogs/UpdateUserDialog";
import AddUserDialog from "../Components/Dialogs/AddUserDialog";

const floatingButtonStyle = {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
};

export default function UsersPage(props: BasePageProps) {
    const token = useAppSelector((state) => state.auth.token);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    let {id} = useParams();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [userDetails, setUserDetails] = useState([] as UserDetail[]);
    const refreshUsers = async () => {
        try {
            props.setShowLoading(true);
            setUserDetails(await getUsers(token));
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    }
    useEffect(() => {
        refreshUsers()
    }, [id, showAddDialog]);
    useEffect(() => {
        setShowUpdateDialog(id !== undefined);
    }, [id]);
    return (
        <Container>
            <Zoom in={true}>
                <Fab sx={floatingButtonStyle} variant="extended" onClick={() => {
                    setShowAddDialog(true)
                }}>
                    <AddOutlinedIcon sx={{mr: 1}}/>
                    Add User
                </Fab>
            </Zoom>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
            >
                <GroupOutlinedIcon sx={{fontSize: 50}}/>
                <div><Typography component="h1" variant="h5" sx={{fontWeight: "bold"}} noWrap>
                    Users
                </Typography>
                    <Typography variant="body1" gutterBottom>
                        All the users in your building. Control their access by setting roles and the flats they can
                        access.
                    </Typography></div>

            </Stack>
            <TransitionGroup>
                {userDetails.map((userDetail) => (
                    <Collapse key={userDetail.id}><UserCard key={userDetail.id} userDetail={userDetail}/></Collapse>
                ))}
            </TransitionGroup>
            <UpdateUserDialog open={showUpdateDialog} setShowLoading={props.setShowLoading}
                              createErrorSnackBar={props.createErrorSnackBar} entityId={id}/>
            <AddUserDialog open={showAddDialog} setShowDialog={setShowAddDialog} setShowLoading={props.setShowLoading}
                           createErrorSnackBar={props.createErrorSnackBar}/>
        </Container>
    );
}