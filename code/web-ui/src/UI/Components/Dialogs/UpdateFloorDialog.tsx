import {AssetDialogProps} from "../../Pages/BaseProps";
import {deleteFloor, getFloor, upsertFloor} from "../../../Repository/ema/floors";
import {useAppSelector} from "../../../hooks";
import {useEffect, useState} from "react";
import {Floor} from "../../../Schemas/ema";
import {useNavigate} from "react-router-dom";
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Stack from '@mui/material/Stack';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DialogContentText from '@mui/material/DialogContentText';
import Tooltip from '@mui/material/Tooltip';
import TextField from "@mui/material/TextField";

export default function UpdateFloorDialog(props: AssetDialogProps) {
    const token = useAppSelector((state) => state.auth.token);
    const navigate = useNavigate();
    const [floor, setFloor] = useState(null as Floor | null);
    const loadAsset = async () => {
        if (props.entityId === undefined) {
            setName("...");
            return navigate("/floors");
        }
        try {
            props.setShowLoading(true);
            let currentFloor = await getFloor(token, props.entityId);
            setFloor(currentFloor);
            setName(currentFloor.name);
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
                navigate("/floors");
            }
        } finally {
            props.setShowLoading(false);
        }
    };
    const deleteAsset = async () => {
        if (props.entityId === undefined) {
            return navigate("/floors");
        }
        try {
            props.setShowLoading(true);
            await deleteFloor(token, props.entityId);
            navigate("/floors");
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    };
    const updateAsset = async () => {
        try {
            props.setShowLoading(true);
            await upsertFloor(token, {id: props.entityId, name: name});
            navigate("/floors");
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    };

    const [name, setName] = useState("");
    useEffect(() => {
        loadAsset();
    }, [props.entityId]);
    return (
        <Dialog maxWidth="xs" fullWidth={true} open={props.open}>
                <DialogTitle>
                    <TextField fullWidth id="name" variant="standard" value={name} onChange={
                        (e) => {
                            setName(e.target.value)
                        }
                    } inputProps={{style: {fontSize: 20, fontWeight: "bold"}}}
                               placeholder="Enter floor name"/>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText> Floor is simple as that. There is no other information to be
                        added.</DialogContentText>

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
                                navigate("/floors")
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