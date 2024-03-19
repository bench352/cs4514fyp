import {BasePageProps} from "../BaseProps";
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {useEffect, useState} from "react";
import {getFloors} from "../../../Repository/ema/floors";
import {useAppSelector} from "../../../hooks";
import {useParams} from "react-router-dom";
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import {getFlats} from "../../../Repository/ema/flats";
import FlatCard from "../../Components/Cards/FlatCard";
import UpdateFlatDialog from "../../Components/Dialogs/EntityManagement/UpdateFlatDialog";
import {TransitionGroup} from 'react-transition-group';
import Collapse from '@mui/material/Collapse';
import AddFlatDialog from "../../Components/Dialogs/EntityManagement/AddFlatDialog";
import Zoom from '@mui/material/Zoom';

const floatingButtonStyle = {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
};

export interface FlatPresentation {
    id: string;
    name: string;
    floorName: string;
}

export default function FlatsPage(props: BasePageProps) {
    const token = useAppSelector((state) => state.auth.token);
    const [showAddDialog, setShowAddDialog] = useState(false);
    let {id} = useParams();
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [flats, setFlats] = useState([] as FlatPresentation[]);
    useEffect(() => {
        setShowUpdateDialog(id !== undefined);
    }, [id]);
    const refreshFlats = async () => {
        try {
            props.setShowLoading(true);
            let allFlats = await getFlats(token);
            let allFloors = await getFloors(token);
            let flatPres: FlatPresentation[] = [];
            allFlats.forEach(flat => {
                let floor = allFloors.find(floor => floor.id === flat.floor_id);
                flatPres.push({
                    id: flat.id ?? "",
                    name: flat.name,
                    floorName: floor ? floor.name : ""
                });
            });
            setFlats(flatPres);
        } catch (e) {
            if (e instanceof Error) {
                props.createErrorSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    }
    useEffect(() => {
        refreshFlats()
    }, [id, showAddDialog]);
    return (
        <Container>
            <Zoom in={true}>
            <Fab sx={floatingButtonStyle} variant="extended" onClick={() => {
                setShowAddDialog(true);
            }}>
                <AddOutlinedIcon sx={{mr: 1}}/>
                Add Flat
            </Fab>
            </Zoom>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
            >
                <MeetingRoomOutlinedIcon sx={{fontSize: 50}}/>
                <div><Typography component="h1" variant="h5" sx={{fontWeight: "bold"}} noWrap>
                    Flats
                </Typography>
                    <Typography variant="body1" gutterBottom>
                        Individual apartment units in your building.
                    </Typography></div>

            </Stack>
            <TransitionGroup>
                {flats.map(flat => (<Collapse key={flat.id}><FlatCard key={flat.id} flat={flat}/></Collapse>))}
            </TransitionGroup>
            <UpdateFlatDialog open={showUpdateDialog} entityId={id} setShowLoading={props.setShowLoading}
                              createErrorSnackBar={props.createErrorSnackBar}/>
            <AddFlatDialog open={showAddDialog} setShowDialog={setShowAddDialog} setShowLoading={props.setShowLoading} createErrorSnackBar={props.createErrorSnackBar} />
        </Container>
    );
}