import { AddAssetDialogProps } from "../../../Pages/BaseProps";
import { useAppSelector } from "../../../../hooks";
import { useEffect, useState } from "react";
import { Role } from "../../../../Schemas/ema";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { createUser } from "../../../../Repository/ema/users";

export default function AddUserDialog(props: AddAssetDialogProps) {
  const token = useAppSelector((state) => state.auth.token);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("RESIDENT" as Role);
  const [initPassword, setInitPassword] = useState("");
  const resetFields = () => {
    setUsername("");
    setFullname("");
    setRole("RESIDENT");
    setInitPassword("");
  };
  const insertAsset = async () => {
    try {
      props.setShowLoading(true);
      let newUser = {
        username: username,
        full_name: fullname,
        role: role,
        init_password: initPassword,
      };
      await createUser(token, newUser);
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
    resetFields();
  }, [props.open]);
  return (
    <Dialog open={props.open} fullWidth maxWidth="xs">
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="stretch"
          spacing={2}
        >
          <TextField
            fullWidth
            label="Username"
            id="fullWidth"
            value={username}
            variant="standard"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <TextField
            fullWidth
            label="Full Name"
            id="fullWidth"
            value={fullname}
            variant="standard"
            onChange={(e) => {
              setFullname(e.target.value);
            }}
          />
          <FormControl variant="standard" fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e: SelectChangeEvent) => {
                setRole(e.target.value as Role);
              }}
              label="Role"
            >
              <MenuItem value="LANDLORD">Landlord</MenuItem>
              <MenuItem value="RESIDENT">Resident</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Initial Password"
            id="fullWidth"
            value={initPassword}
            variant="standard"
            onChange={(e) => {
              setInitPassword(e.target.value);
            }}
          />
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
