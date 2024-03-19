import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { DeviceRepresentation } from "../../Pages/EntityManagement/DevicesPage";
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";

export default function DeviceCard(props: { device: DeviceRepresentation }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ marginBottom: "10px" }}>
      <CardActionArea
        onClick={() => {
          navigate(`/devices/${props.device.id}`);
        }}
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          sx={{ margin: "10px" }}
        >
          <MemoryOutlinedIcon />
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={0}
          >
            <Typography variant="h6" component="h6" noWrap>
              {props.device.displayName} ({props.device.name})
            </Typography>
            <Chip size="small" label={props.device.flatName} />
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
