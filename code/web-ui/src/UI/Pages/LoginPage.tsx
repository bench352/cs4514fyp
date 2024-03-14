import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import loginBG from "../images/bady-abbas-hxi_yRxODNc-unsplash.jpg";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import Auth from "../../Repository/ema/auth";
import {useAppDispatch} from "../../hooks";
import {useNavigate} from "react-router-dom";


type LoginForm = {
    username: string;
    password: string;
}

const emaService = new Auth();

function LoginCard() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    // const authToken = useAppSelector((state: RootState) => state.auth.token);
    const [error, setError] = useState(false);
    const [loginButtonLoading, showLoginButtonLoading] = useState(false);
    const [errorText, setErrorText] = useState("");
    const {
        register,
        handleSubmit,
    } = useForm<LoginForm>();
    const onLogin: SubmitHandler<LoginForm> = async (data) => {
        try {
            showLoginButtonLoading(true);
            if (data.username === "" || data.password === "") {
                throw new Error("I don't have eyes, so I can't recognize you without your username and password :(");
            }
            const token = await emaService.login(data.username, data.password);
            dispatch({type: 'auth/login', payload: token});
            navigate("/");
        } catch (e) {
            if (e instanceof Error) {
                setErrorText(e.message);
                setError(true);
            }
        } finally {
            showLoginButtonLoading(false);
        }
    }
    return (
        <Card sx={{width: 500}}>
            <CardMedia
                sx={{height: 250}}
                image={loginBG}
            />
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
                    sx={{marginTop: 2}}
                >
                    <Collapse in={error}><Alert severity="error">{errorText}</Alert></Collapse>

                    <TextField id="username" label="Username" variant="outlined" {...register("username")}/>
                    <TextField
                        id="password"
                        variant="outlined"
                        type="password"
                        label="Password"
                        autoComplete="current-password"
                        {...register("password")}
                    />
                    <LoadingButton variant="contained" endIcon={<LoginOutlinedIcon/>}
                                   onClick={handleSubmit(onLogin)} loading={loginButtonLoading}>Login</LoadingButton>
                </Stack>

            </CardContent>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <Grid container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{minHeight: '100vh', backgroundColor: "#bdbdbd"}}>
            <LoginCard/>

        </Grid>
    )
}