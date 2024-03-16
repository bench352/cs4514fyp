import {AssetDialogProps} from "../../Pages/BaseProps";
import {useAppSelector} from "../../../hooks";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Flat, Role} from "../../../Schemas/ema";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import {addFlatToUser, deleteUser, getUser, removeUserFromFlat, updateUser} from "../../../Repository/ema/users";
import {getFlats} from "../../../Repository/ema/flats";

export default function UpdateUserDialog(props: AssetDialogProps) {
    const token = useAppSelector((state) => state.auth.token);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [userRole, setUserRole] = useState("RESIDENT" as Role);
    const [flatId, setFlatId] = useState("");
    const [flats, setFlats] = useState([] as Flat[]);
    const loadAsset = async () => {
        if (props.entityId === undefined) {
            setUsername("");
            setFullName("");
            setUserRole("RESIDENT");
            setFlatId("");
            return navigate("/users");
        }
        try {
            props.setShowLoading(true);
            setFlats(await getFlats(token));
            let currentUser = await getUser(token, props.entityId);
            setUsername(currentUser.username);
            setFullName(currentUser.full_name);
            setUserRole(currentUser.role);
            if (currentUser.flat != null) {
                setFlatId(currentUser.flat.id as string);
            }
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
                navigate("/users");
            }
        } finally {
            props.setShowLoading(false);
        }
    }
    const deleteAsset = async () => {
        if (props.entityId === undefined) {
            return navigate("/users");
        }
        try {
            props.setShowLoading(true);
            await deleteUser(token, props.entityId);
            navigate("/users");
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    }
    const updateAsset = async () => {
        if (props.entityId === undefined) {
            return navigate("/users");
        }
        try {
            props.setShowLoading(true);
            await updateUser(token, {
                id: props.entityId,
                username: username,
                full_name: fullName,
                role: userRole
            });
            await removeUserFromFlat(token, props.entityId);
            if (userRole === "RESIDENT") {
                if (flatId != "") {
                    await addFlatToUser(token, props.entityId, flatId);
                }
            }
            navigate("/users");
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    }
    useEffect(() => {
        loadAsset();
    }, [props.open]);
    return (
        <Dialog maxWidth="xs" fullWidth={true} open={props.open}>
            <DialogTitle>
                <TextField fullWidth id="name" variant="standard" value={fullName} onChange={
                    (e) => {
                        setFullName(e.target.value);
                    }
                } inputProps={{style: {fontSize: 20, fontWeight: "bold"}}}
                           placeholder="Enter full name"/>
            </DialogTitle>
            <DialogContent>
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    spacing={2}
                >
                    <TextField label="Username" variant="standard" fullWidth
                               value={username} onChange={
                        (e) => {
                            setUsername(e.target.value);
                        }
                    }/>

                    <FormControl variant="standard" fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={userRole}
                            onChange={(e: SelectChangeEvent) => {
                                setUserRole(e.target.value as Role);
                            }}
                            label="Role"
                        >
                            <MenuItem value="LANDLORD">Landlord</MenuItem>
                            <MenuItem value="RESIDENT">Resident</MenuItem>
                        </Select>
                    </FormControl>
                    {userRole === "RESIDENT" ? (
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Assigned To Flat</InputLabel>
                            <Select
                                value={flatId}
                                onChange={(e: SelectChangeEvent) => {
                                    setFlatId(e.target.value as string)
                                }}
                                label="Assigned To Flat"
                            >
                                <MenuItem value=""><em>Unassigned</em></MenuItem>
                                {flats.map(flat => <MenuItem value={flat.id as string}>{flat.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    ) : ""}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    width={"100%"}
                >
                    <Tooltip title="Back">
                        <IconButton aria-label="back" size="large" onClick={() => {
                            navigate("/users")
                        }}>
                            <ArrowBackOutlinedIcon fontSize="inherit"/>
                        </IconButton>
                    </Tooltip>
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="baseline"
                        spacing={1}
                    >
                        <Tooltip title="Delete">
                            <IconButton aria-label="delete" size="large" onClick={deleteAsset}>
                                <DeleteForeverOutlinedIcon fontSize="inherit"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Save">
                            <IconButton aria-label="save" size="large" onClick={updateAsset}>
                                <CheckOutlinedIcon fontSize="inherit"/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}