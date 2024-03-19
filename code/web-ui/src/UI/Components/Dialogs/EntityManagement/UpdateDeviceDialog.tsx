import { AssetDialogProps } from "../../../Pages/BaseProps";
import { useAppSelector } from "../../../../hooks";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Device, Flat } from "../../../../Schemas/ema";
import { getFlats } from "../../../../Repository/ema/flats";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import {
  deleteDevice,
  getDevice,
  upsertDevice,
} from "../../../../Repository/ema/devices";

export default function UpdateDeviceDialog(props: AssetDialogProps) {
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [device, setDevice] = useState(null as Device | null);
  const [flats, setFlats] = useState([] as Flat[]);
  const [displayName, setDisplayName] = useState("" as string);
  const [description, setDescription] = useState("" as string);
  const [selectFlatId, setSelectFlatId] = useState("" as string);
  const loadAsset = useCallback(async () => {
    if (props.entityId === undefined) {
      setDisplayName("");
      setDescription("");
      return navigate("/devices");
    }
    try {
      props.setShowLoading(true);
      setFlats(await getFlats(token));
      let currentDevice = await getDevice(token, props.entityId);
      setDevice(currentDevice);
      setSelectFlatId(currentDevice.flat_id);
      setDisplayName(currentDevice.display_name);
      setDescription(currentDevice.description);
    } catch (e) {
      if (e instanceof Error) {
        props.createErrorSnackBar(e.message);
        navigate("/devices");
      }
    } finally {
      props.setShowLoading(false);
    }
  }, [navigate, props, token]);
  const deleteAsset = async () => {
    if (props.entityId === undefined) {
      return navigate("/devices");
    }
    try {
      props.setShowLoading(true);
      await deleteDevice(token, props.entityId);
      navigate("/devices");
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
      if (device === null) {
        return;
      }
      props.setShowLoading(true);
      await upsertDevice(token, device);
      navigate("/devices");
    } catch (e) {
      if (e instanceof Error) {
        props.createErrorSnackBar(e.message);
      }
    } finally {
      props.setShowLoading(false);
    }
  };
  useEffect(() => {
    loadAsset();
  }, [loadAsset, props.open]);
  return (
    <Dialog maxWidth="xs" fullWidth={true} open={props.open}>
      <DialogTitle>
        <TextField
          fullWidth
          id="name"
          variant="standard"
          value={device?.name}
          onChange={(e) => {
            if (device !== null) {
              setDevice({ ...device, name: e.target.value });
            }
          }}
          inputProps={{ style: { fontSize: 20, fontWeight: "bold" } }}
          placeholder="Enter device name"
        />
      </DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          spacing={2}
        >
          <TextField
            label="Display Name"
            variant="standard"
            fullWidth
            value={displayName}
            onChange={(e) => {
              if (device !== null) {
                setDevice({ ...device, display_name: e.target.value });
                setDisplayName(e.target.value);
              }
            }}
          />
          <TextField
            label="Description"
            variant="standard"
            multiline
            rows={4}
            fullWidth
            value={description}
            onChange={(e) => {
              if (device !== null) {
                setDevice({ ...device, description: e.target.value });
                setDescription(e.target.value);
              }
            }}
          />
          <FormControl variant="standard" fullWidth>
            <InputLabel>Flat</InputLabel>
            <Select
              value={selectFlatId}
              onChange={(e: SelectChangeEvent) => {
                if (device !== null) {
                  setDevice({ ...device, flat_id: e.target.value as string });
                  setSelectFlatId(e.target.value as string);
                }
              }}
              label="Flat"
            >
              {flats.map((flat) => (
                <MenuItem key={flat.id} value={flat.id}>
                  {flat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            <IconButton
              aria-label="back"
              size="large"
              onClick={() => {
                navigate("/devices");
              }}
            >
              <ArrowBackOutlinedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="baseline"
            spacing={1}
          >
            <Tooltip title="Delete">
              <IconButton
                aria-label="delete"
                size="large"
                onClick={deleteAsset}
              >
                <DeleteForeverOutlinedIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save">
              <IconButton aria-label="save" size="large" onClick={updateAsset}>
                <CheckOutlinedIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
