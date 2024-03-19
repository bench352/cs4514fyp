import { AssetDialogProps } from "../../../Pages/BaseProps";
import { useAppSelector } from "../../../../hooks";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Flat, Floor } from "../../../../Schemas/ema";
import { getFloors } from "../../../../Repository/ema/floors";
import {
  deleteFlat,
  getFlat,
  upsertFlat,
} from "../../../../Repository/ema/flats";
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

export default function UpdateFlatDialog(props: AssetDialogProps) {
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [flat, setFlat] = useState(null as Flat | null);
  const [floors, setFloors] = useState([] as Floor[]);
  const [selectFloorId, setSelectFloorId] = useState("" as string);
  const loadAsset = useCallback(async () => {
    if (props.entityId === undefined) {
      return navigate("/flats");
    }
    try {
      props.setShowLoading(true);
      setFloors(await getFloors(token));
      let currentFlat = await getFlat(token, props.entityId);
      setFlat(currentFlat);
      setSelectFloorId(currentFlat.floor_id);
    } catch (e) {
      if (e instanceof Error) {
        props.createErrorSnackBar(e.message);
        navigate("/flats");
      }
    } finally {
      props.setShowLoading(false);
    }
  }, [navigate, props, token]);
  const deleteAsset = async () => {
    if (props.entityId === undefined) {
      return navigate("/flats");
    }
    try {
      props.setShowLoading(true);
      await deleteFlat(token, props.entityId);
      navigate("/flats");
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
      if (flat === null) {
        return;
      }
      props.setShowLoading(true);
      await upsertFlat(token, flat);
      navigate("/flats");
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
  }, [props.open, props.entityId, loadAsset]);
  return (
    <Dialog maxWidth="xs" fullWidth={true} open={props.open}>
      <DialogTitle>
        <TextField
          fullWidth
          id="name"
          variant="standard"
          value={flat?.name}
          onChange={(e) => {
            if (flat !== null) {
              setFlat({ ...flat, name: e.target.value });
            }
          }}
          inputProps={{ style: { fontSize: 20, fontWeight: "bold" } }}
          placeholder="Enter flat name"
        />
      </DialogTitle>
      <DialogContent>
        <FormControl variant="standard" fullWidth>
          <InputLabel>Floor</InputLabel>
          <Select
            value={selectFloorId}
            onChange={(e: SelectChangeEvent) => {
              if (flat !== null) {
                setFlat({ ...flat, floor_id: e.target.value as string });
                setSelectFloorId(e.target.value as string);
              }
            }}
            label="Floor"
          >
            {floors.map((floor) => (
              <MenuItem key={floor.id} value={floor.id}>
                {floor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
                navigate("/flats");
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
