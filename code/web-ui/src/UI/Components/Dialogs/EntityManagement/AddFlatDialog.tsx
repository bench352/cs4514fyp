import { AddAssetDialogProps } from "../../../Pages/BaseProps";
import { useAppSelector } from "../../../../hooks";
import { Flat, Floor } from "../../../../Schemas/ema";
import { getFloors } from "../../../../Repository/ema/floors";
import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { upsertFlat } from "../../../../Repository/ema/flats";

export default function AddFlatDialog(props: AddAssetDialogProps) {
  const token = useAppSelector((state) => state.auth.token);
  const [name, setName] = useState("");
  const [floorId, setFloorId] = useState("");
  const [floors, setFloors] = useState([] as Floor[]);
  const refreshOptions = useCallback(async () => {
    props.setShowLoading(true);
    let currentFloors = await getFloors(token);
    setFloors(currentFloors);
    setName("");
    if (currentFloors.length > 0) {
      setFloorId(currentFloors[0]?.id as string);
    }
    props.setShowLoading(false);
  }, [props, token]);
  const insertAsset = async () => {
    try {
      props.setShowLoading(true);
      let newFlat: Flat = {
        name: name,
        floor_id: floorId,
      };
      await upsertFlat(token, newFlat);
      props.setShowDialog(false);
    } catch (e) {
      if (e instanceof Error) {
        props.createErrorSnackBar(e.message);
      }
    } finally {
      props.setShowLoading(false);
    }
  };
  useEffect(() => {
    refreshOptions();
  }, [props.open, refreshOptions]);
  return (
    <Dialog open={props.open} fullWidth maxWidth="xs">
      <DialogTitle>Add Floor</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="stretch"
          spacing={1}
        >
          <TextField
            fullWidth
            label="Name"
            id="fullWidth"
            value={name}
            variant="standard"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <FormControl variant="standard" fullWidth>
            <InputLabel>Floor</InputLabel>
            <Select
              value={floorId}
              onChange={(e: SelectChangeEvent) => {
                setFloorId(e.target.value as string);
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
                props.setShowDialog(false);
              }}
            >
              <ArrowBackOutlinedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Save">
            <IconButton aria-label="save" size="large" onClick={insertAsset}>
              <CheckOutlinedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
