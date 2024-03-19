import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Auth from "../../../Repository/ema/auth";
import TextField from "@mui/material/TextField";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useEffect, useState } from "react";

type ChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
};

const emaService = new Auth();

interface ChangePasswordDialogProps {
  open: boolean;
  setShowDialog: (open: boolean) => void;
  setShowLoading: (loading: boolean) => void;
  createSnackBar: (message: string) => void;
}

function PasswordChangeSuccessDialog(props: { open: boolean }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const logout = async () => {
    dispatch({ type: "auth/logout" });
    navigate("/login");
  };
  return (
    <Dialog open={props.open} fullWidth maxWidth="xs">
      <DialogTitle>Password Changed Successfully</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your password has been changed successfully. Just to be safe, you will
          be logged out now. Please login again with your new password.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={logout}>
          Sure
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ChangePasswordDialog(props: ChangePasswordDialogProps) {
  const token = useAppSelector((state) => state.auth.token);
  const { register, handleSubmit, reset } = useForm<ChangePasswordForm>();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const changePassword = async (data: ChangePasswordForm) => {
    try {
      props.setShowLoading(true);
      await emaService.changePassword(
        token,
        data.oldPassword,
        data.newPassword,
      );
      props.setShowLoading(false);
      setShowSuccessDialog(true);
    } catch (e) {
      if (e instanceof Error) {
        props.createSnackBar(e.message);
      }
    } finally {
      props.setShowLoading(false);
    }
  };
  useEffect(() => {
    reset({
      oldPassword: "",
      newPassword: "",
    });
  }, [props.open]);
  return (
    <Dialog open={props.open} fullWidth maxWidth="xs">
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="stretch"
          spacing={2}
          sx={{ marginTop: 2 }}
        >
          <TextField
            id="current-password"
            label="Current Password"
            variant="standard"
            type="password"
            autoComplete="current-password"
            {...register("oldPassword")}
          />
          <TextField
            id="new-password"
            variant="standard"
            type="password"
            label="New Password"
            {...register("newPassword")}
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
          <Tooltip title="Apply">
            <IconButton
              aria-label="save"
              size="large"
              onClick={handleSubmit(changePassword)}
            >
              <CheckOutlinedIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>
      </DialogActions>
      <PasswordChangeSuccessDialog open={showSuccessDialog} />
    </Dialog>
  );
}
