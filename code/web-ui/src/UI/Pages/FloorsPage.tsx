import {BasePageProps} from "./BaseProps";
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Typography from '@mui/material/Typography';
import {Floor} from "../../Schemas/ema";
import Stack from '@mui/material/Stack';
import {useEffect, useState} from "react";
import FloorCard from "../Components/Cards/FloorCard";
import {getFloors} from "../../Repository/ema/floors";
import {useAppSelector} from "../../hooks";
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import {useParams} from "react-router-dom";
import UpdateFloorDialog from "../Components/Dialogs/UpdateFloorDialog";
import AddFloorDialog from "../Components/Dialogs/AddFloorDialog";

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
    let {id} = useParams();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const refreshFloors = async () => {
        try {
            props.setShowLoading(true);
            setFloors(await getFloors(token));
        } catch (e) {
            if (e instanceof Error) {
                props.createSnackBar(e.message);
            }
        } finally {
            props.setShowLoading(false);
        }
    }

    useEffect(() => {
        refreshFloors()
    }, [id, showAddDialog])
    useEffect(() => {
        setShowUpdateDialog(id !== undefined)
    }, [id]);
    return (
        <Container>
            <Fab sx={floatingButtonStyle} variant="extended" onClick={() => {
                setShowAddDialog(true)
            }}>
                <AddOutlinedIcon sx={{mr: 1}}/>
                Add Floor
            </Fab>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
            >
                <ApartmentOutlinedIcon sx={{fontSize: 50}}/>
                <div><Typography component="h1" variant="h5" sx={{fontWeight: "bold"}} noWrap>
                    Floors
                </Typography>
                    <Typography variant="body1" gutterBottom>
                        All the floors in your building.
                    </Typography></div>

            </Stack>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                spacing={1}
            >
                {floors.map(floor => (<FloorCard floor={floor}/>))}
            </Stack>
            <UpdateFloorDialog open={showUpdateDialog} assetId={id} setShowLoading={props.setShowLoading}
                               createSnackBar={props.createSnackBar}/>
            <AddFloorDialog setShowDialog={setShowAddDialog} open={showAddDialog} setShowLoading={props.setShowLoading}
                            createSnackBar={props.createSnackBar}/>
        </Container>
    );
}