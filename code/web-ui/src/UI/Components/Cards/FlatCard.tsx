import { FlatPresentation } from "../../Pages/EntityManagement/FlatsPage";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import Stack from "@mui/material/Stack";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";

export default function FlatCard(props: { flat: FlatPresentation }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ marginBottom: "10px" }}>
      <CardActionArea
        onClick={() => {
          navigate(`/flats/${props.flat.id}`);
        }}
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          sx={{ margin: "10px" }}
        >
          <MeetingRoomOutlinedIcon />
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={0}
          >
            <Typography variant="h6" component="h6" noWrap>
              {props.flat.name}
            </Typography>
            <Chip size="small" label={props.flat.floorName} />
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
