import { BasePageProps } from "../BaseProps";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Typography from "@mui/material/Typography";
import { Floor } from "../../../Schemas/ema";
import Stack from "@mui/material/Stack";
import { useCallback, useEffect, useState } from "react";
import FloorCard from "../../Components/Cards/FloorCard";
import { getFloors } from "../../../Repository/ema/floors";
import { useAppSelector } from "../../../hooks";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import { useParams } from "react-router-dom";
import UpdateFloorDialog from "../../Components/Dialogs/EntityManagement/UpdateFloorDialog";
import AddFloorDialog from "../../Components/Dialogs/EntityManagement/AddFloorDialog";
import { TransitionGroup } from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import Zoom from "@mui/material/Zoom";

const floatingButtonStyle = {
  margin: 0,
  top: "auto",
  right: 20,
  bottom: 20,
  left: "auto",
  position: "fixed",
};

export default function FloorsPage(props: BasePageProps) {
  const token = useAppSelector((state) => state.auth.token);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [floors, setFloors] = useState([] as Floor[]);
  let { id } = useParams();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const refreshFloors = useCallback(async () => {
    try {
      props.setShowLoading(true);
      let currentFloors = await getFloors(token);
      setFloors(currentFloors);
    } catch (e) {
      if (e instanceof Error) {
        props.createErrorSnackBar(e.message);
      }
    } finally {
      props.setShowLoading(false);
    }
  }, [props, token]);

  useEffect(() => {
    refreshFloors();
  }, [id, refreshFloors, showAddDialog]);
  useEffect(() => {
    setShowUpdateDialog(id !== undefined);
  }, [id]);
  return (
    <Container>
      <Zoom in={true}>
        <Fab
          sx={floatingButtonStyle}
          variant="extended"
          onClick={() => {
            setShowAddDialog(true);
          }}
        >
          <AddOutlinedIcon sx={{ mr: 1 }} />
          Add Floor
        </Fab>
      </Zoom>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
      >
        <ApartmentOutlinedIcon sx={{ fontSize: 50 }} />
        <div>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: "bold" }}
            noWrap
          >
            Floors
          </Typography>
          <Typography variant="body1" gutterBottom>
            All the floors in your building.
          </Typography>
        </div>
      </Stack>
      <TransitionGroup>
        {floors.map((floor) => (
          <Collapse key={floor.id}>
            <FloorCard key={floor.id} floor={floor} />
          </Collapse>
        ))}
      </TransitionGroup>
      <UpdateFloorDialog
        open={showUpdateDialog}
        entityId={id}
        setShowLoading={props.setShowLoading}
        createErrorSnackBar={props.createErrorSnackBar}
      />
      <AddFloorDialog
        setShowDialog={setShowAddDialog}
        open={showAddDialog}
        setShowLoading={props.setShowLoading}
        createErrorSnackBar={props.createErrorSnackBar}
      />
    </Container>
  );
}
