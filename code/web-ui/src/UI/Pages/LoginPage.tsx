import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import loginBG from "../images/login-banner-image.jpg";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Auth from "../../Repository/ema/auth";
import { useAppDispatch } from "../../hooks";
import { useNavigate } from "react-router-dom";

type LoginForm = {
  username: string;
  password: string;
};

const emaService = new Auth();

function LoginCard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const authToken = useAppSelector((state: RootState) => state.auth.token);
  const [error, setError] = useState(false);
  const [loginButtonLoading, showLoginButtonLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const { register, handleSubmit } = useForm<LoginForm>();
  const onLogin: SubmitHandler<LoginForm> = async (data) => {
    try {
      showLoginButtonLoading(true);
      if (data.username === "" || data.password === "") {
        throw new Error("Please enter both username and password to login.");
      }
      const token = await emaService.login(data.username, data.password);
      dispatch({ type: "auth/login", payload: token });
      navigate("/");
    } catch (e) {
      if (e instanceof Error) {
        setErrorText(e.message);
        setError(true);
      }
    } finally {
      showLoginButtonLoading(false);
    }
  };
  return (
    <Card sx={{ width: 500 }}>
      <CardMedia sx={{ height: 250 }} image={loginBG} />
      <CardContent>
        <Typography align="center" variant="h5" component="div">
          Smart Home Management System
        </Typography>
        <Typography align="center" variant="body1" color="text.secondary">
          Welcome! Please login to continue.
        </Typography>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="stretch"
          spacing={2}
          sx={{ marginTop: 2 }}
        >
          <Collapse in={error}>
            <Alert severity="error">{errorText}</Alert>
          </Collapse>

          <TextField
            id="username"
            label="Username"
            variant="outlined"
            {...register("username")}
          />
          <TextField
            id="password"
            variant="outlined"
            type="password"
            label="Password"
            autoComplete="current-password"
            {...register("password")}
          />
          <LoadingButton
            variant="contained"
            endIcon={<LoginOutlinedIcon />}
            onClick={handleSubmit(onLogin)}
            loading={loginButtonLoading}
          >
            Login
          </LoadingButton>
          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            sx={{
              color: "#757575",
              "& a": {
                textDecoration: "none",
                color: "#757575",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
            }}
          >
            Banner image by{" "}
            <a href="https://unsplash.com/@bady?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
              bady abbas
            </a>{" "}
            on{" "}
            <a href="https://unsplash.com/photos/white-cubby-shelf-hxi_yRxODNc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
              Unsplash
            </a>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "#bdbdbd" }}
    >
      <LoginCard />
    </Grid>
  );
}
