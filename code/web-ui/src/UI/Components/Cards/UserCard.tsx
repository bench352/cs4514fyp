import {useNavigate} from "react-router-dom";
import Card from "@mui/material/Card";
import {CardActionArea} from "@mui/material";
import Stack from "@mui/material/Stack";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {UserDetail} from "../../../Schemas/ema";
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

export default function FlatCard(props: { userDetail: UserDetail }) {
    const navigate = useNavigate();
    return <Card sx={{marginBottom: "10px"}}>
        <CardActionArea onClick={() => {
            navigate(`/users/${props.userDetail.id}`)
        }}>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
                sx={{margin: "10px"}}
            >
                <PersonOutlineOutlinedIcon/>
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={0}
                >
                    <Typography
                        variant="h6"
                        component="h6"
                        noWrap
                    >
                        {props.userDetail.full_name} (@{props.userDetail.username})
                    </Typography>
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                    >
                        <Chip size="small" icon={<WorkspacePremiumOutlinedIcon/>} label={props.userDetail.role}/>
                        {props.userDetail.flat !== null && props.userDetail.role === "RESIDENT" ? (
                            <Chip size="small" icon={<MeetingRoomOutlinedIcon/>} label={props.userDetail.flat.name}/>
                        ) : ""
                        }
                    </Stack>
                </Stack>
            </Stack>
        </CardActionArea>
    </Card>;
}