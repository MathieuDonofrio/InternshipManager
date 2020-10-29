import { Box, Container, IconButton, Typography } from "@material-ui/core";
import ArrowBack from '@material-ui/icons/ArrowBack';
import React from "react";
import { useHistory, useParams } from 'react-router-dom';
import StudentApplicationStatusList from "./StudentApplicationStatusList";
import Paper from '@material-ui/core/Paper';
import Portfolio from "./Portfolio";

export default function StudentProfile() {

    const { uuid } = useParams();
    const { fullName } = useParams();
    const history = useHistory()

    return (
        <div>
            <IconButton aria-label="delete" color="primary" onClick={() => history.push("/student-list-page")}>
                <ArrowBack />
            </IconButton>

            <Container>
                <Box
                    paddingTop={2}
                    textAlign="center"
                    borderBottom="1px solid black"
                    width="40%"
                    margin="0px auto">

                    <Typography component="h1" variant="h4">{fullName}</Typography>
                </Box>
            </Container>

            <Box
                marginTop={10}
                width="90%"
                margin="0px auto"
            >
                <Paper elevation={6}>
                    <StudentApplicationStatusList studentId={uuid} />
                </Paper>
            </Box>

            <Box
                marginTop={10}
                width="90%"
                margin="0px auto"
            >
                <Paper elevation={6}>
                    <Portfolio studentId={uuid} />
                </Paper>
            </Box>
        </div>
    )
}