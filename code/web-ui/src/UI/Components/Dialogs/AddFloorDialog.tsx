import {AddAssetDialogProps} from "../../Pages/BaseProps";
import {upsertFloor} from "../../../Repository/ema/floors";
import {useAppSelector} from "../../../hooks";
import {useState} from "react";
import {Floor} from "../../../Schemas/ema";
import {useNavigate} from "react-router-dom";
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DialogContent from '@mui/material/DialogContent';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Tooltip from '@mui/material/Tooltip';
import DialogActions from '@mui/material/DialogActions';
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';


export default function AddFloorDialog(props: AddAssetDialogProps) {
    const token = useAppSelector((state) => state.auth.token);
    const navigate = useNavigate();
    const insertAsset = async () => {
        try {
            props.setShowLoading(true);
            let newFloor: Floor = {
                name: name,
            }
            await upsertFloor(token, newFloor);
            props.setShowDialog(false);
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    }
    const [name, setName] = useState("");
    return (
        <Dialog open={props.open} fullWidth maxWidth="xs">
            <DialogTitle>
                Add Floor
            </DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Name" id="fullWidth" variant="standard" onChange={
                    (e) => {
                        setName(e.target.value)
                    }}
                />
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