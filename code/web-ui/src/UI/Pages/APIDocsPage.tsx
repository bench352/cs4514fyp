import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Container from '@mui/material/Container';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import {env} from "../../env"

export default function APIDocsPage() {
    return (
        <Container>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={1}
            >
                <CodeOutlinedIcon sx={{fontSize: 50}}/>
                <div><Typography component="h1" variant="h5" sx={{fontWeight: "bold"}} noWrap>
                    API Documentations
                </Typography>
                    <Typography variant="body1" gutterBottom>
                        Apart from this user-friendly web interface, you can interact with the Smart Home Management
                        System using Rest APIs. You can find the documentation of the various services that serve
                        different types of data below:
                    </Typography></div>
            </Stack>
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="stretch"
                spacing={2}
            >
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Entity Management & Authentication Service
                        </Typography>
                        <Typography variant="body1">
                            An identity and entity management service for serving data that represents the detailed
                            information of every entity in the system (including users, rooms, and devices) as well as
                            mapping each IoT device to rooms and users. It also manages credentials for all users in the
                            system and lets other services look up the permission of a given user for authorization.
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="medium" color="secondary" onClick={() => {
                            window.open(`${env.REACT_APP_EMA_SERVICE_URL}/docs`)
                        }}>
                            API Documentation
                        </Button>
                    </CardActions>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Device Data Service
                        </Typography>
                        <Typography variant="body1">
                            Serve device-related data from the database via REST APIs, including the latest and
                            historical data from IoT sensors.
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="medium" color="secondary" onClick={() => {
                            window.open(`${env.REACT_APP_DEVICE_DATA_SERVICE_URL}/docs`)
                        }}>
                            API Documentation
                        </Button>
                    </CardActions>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Device Healthiness Monitoring Service
                        </Typography>
                        <Typography variant="body1">
                            Serve anomaly detection results from the database via REST APIs.
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="medium" color="secondary" onClick={() => {
                            window.open(`${env.REACT_APP_DEVICE_HEALTH_SERVICE_URL}/docs`)
                        }}>
                            API Documentation
                        </Button>
                    </CardActions>
                </Card>
            </Stack>
        </Container>
    )
}