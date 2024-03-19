import {AddAssetDialogProps} from "../../../Pages/BaseProps";
import {useAppSelector} from "../../../../hooks";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Device, Flat} from "../../../../Schemas/ema";
import {getFlats} from "../../../../Repository/ema/flats";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import {upsertDevice} from "../../../../Repository/ema/devices";


export default function AddDeviceDialog(props: AddAssetDialogProps) {
    const token = useAppSelector((state) => state.auth.token);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [flatId, setFlatId] = useState("");
    const [flats, setFlats] = useState([] as Flat[]);
    const [description, setDescription] = useState("");
    const [displayName, setDisplayName] = useState("");

    const refreshOptions = async () => {
        try {
            props.setShowLoading(true);
            let currentFlats = await getFlats(token);
            setFlats(currentFlats);
            setName("");
            setDescription("");
            setDisplayName("");
            if (currentFlats.length > 0) {
                setFlatId(currentFlats[0]?.id as string);
            }
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    }
    const insertAsset = async () => {
        try {
            props.setShowLoading(true);
            let newDevice: Device = {
                name: name,
                flat_id: flatId,
                description: description,
                display_name: displayName
            }
            await upsertDevice(token, newDevice);
            props.setShowDialog(false);
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }

    }
    useEffect(() => {
        refreshOptions();
    }, [props.open]);
    return (
        <Dialog open={props.open} fullWidth maxWidth="xs">
            <DialogTitle>
                Add Device
            </DialogTitle>
            <DialogContent>
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    spacing={2}
                >
                    <TextField fullWidth label="Name" id="fullWidth" value={name} variant="standard" onChange={
                        (e) => {
                            setName(e.target.value)
                        }}
                    />
                    <TextField label="Display Name" variant="standard" fullWidth
                               value={displayName} onChange={
                        (e) => {
                            setDisplayName(e.target.value);
                        }
                    }/>
                    <TextField label="Description" variant="standard" multiline rows={4} fullWidth
                               value={description} onChange={
                        (e) => {
                            setDescription(e.target.value);
                        }
                    }/>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel>Flat</InputLabel>
                        <Select
                            value={flatId}
                            onChange={(e: SelectChangeEvent) => {
                                setFlatId(e.target.value as string)
                            }}
                            label="Flat"
                        >
                            {flats.map(flat => <MenuItem value={flat.id}>{flat.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack>
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

                    <Tooltip title="Save">
                        <IconButton aria-label="save" size="large" onClick={insertAsset}>
                            <CheckOutlinedIcon fontSize="inherit"/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </DialogActions>
        </Dialog>);
}