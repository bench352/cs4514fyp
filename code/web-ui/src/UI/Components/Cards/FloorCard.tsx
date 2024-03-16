import Card from '@mui/material/Card';
import {Floor} from "../../../Schemas/ema";
import {CardActionArea} from '@mui/material';
import {useNavigate} from "react-router-dom";
import Stack from '@mui/material/Stack';
import StairsOutlinedIcon from '@mui/icons-material/StairsOutlined';
import Typography from '@mui/material/Typography';

export default function FloorCard(props: { floor: Floor }) {
    const navigate = useNavigate();
    return (<Card sx={{marginBottom:"10px"}}>
        <CardActionArea onClick={() => {
            navigate(`/floors/${props.floor.id}`)
        }}>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
                sx={{margin: "10px"}}
            >
                <StairsOutlinedIcon/>
                <Typography
                    variant="h6"
                    component="h6"
                    noWrap
                >
                    {props.floor.name}
                </Typography>
            </Stack>
        </CardActionArea>
    </Card>)


}