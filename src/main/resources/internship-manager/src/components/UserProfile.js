import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';

import UserService from "../services/UserService";

import StudentApplicationStatusList from "./StudentApplicationStatusList";
import StudentSelection from "./StudentSelection";
import Portfolio from "./Portfolio";

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

export default function UserProfile() {

    const { uuid } = useParams();
    const history = useHistory()

    const [user, setUser] = useState({});

    const fetch = () => {

        UserService.find(uuid).then(response => {

            setUser(response.data);

            console.log(response);

        });
    }

    const isStudent = () => { return user.type == "STUDENT"; };

    const isEmployer = () => { return user.type == "EMPLOYER"; };

    const translateType = (type) => {
        switch (type) {
            case "STUDENT": return "Étudiant";
            case "EMPLOYER": return "Employé";
            case "ADMINISTRATOR": return "Administrator";
        }
    }

    useEffect(() => { fetch(); }, [])

    return (
        <div>
            <IconButton
                onClick={() => history.goBack()}>
                <KeyboardBackspaceIcon />
                <Typography>Retour</Typography>
            </IconButton>

            <Container>
                <Box
                    margin={2}
                    textAlign="center">

                    <Typography variant="h3">{user.firstName + ' ' + user.lastName}</Typography>
                    <Typography
                        style={{ color: "gray" }}
                        variant="subtitle1">{uuid}</Typography>
                </Box>

                <Box>

                    <Table size="small">

                        <TableHead>
                            <TableCell width="30%"></TableCell>
                            <TableCell width="70%"></TableCell>
                        </TableHead>

                        <TableRow>
                            <TableCell align="left"><strong>Type</strong></TableCell>
                            <TableCell align="right">{translateType(user.type)}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="left"><strong>Email</strong></TableCell>
                            <TableCell align="right">{user.email}</TableCell>
                        </TableRow>

                        {
                            isEmployer() &&
                            <TableRow>
                                <TableCell align="left"><strong>Company</strong></TableCell>
                                <TableCell align="right">{ }</TableCell>
                            </TableRow>
                        }

                    </Table>

                </Box>

                <Box
                    marginTop={2}
                    textAlign="center">
                    <Box
                        marginBottom={1}
                        style={{ backgroundColor: "lightsteelblue" }}>
                        <Typography>{ }</Typography>
                    </Box>
                </Box>


                <Box
                    marginTop={2}>

                    {
                        isStudent() &&
                        <Box
                            mt={2}
                        >
                            <StudentApplicationStatusList studentId={uuid} />
                        </Box>
                    }

                    {
                        isStudent() &&
                        <Box
                            mt={2}
                        >
                            <Portfolio studentId={uuid} />
                        </Box>
                    }

                    {
                        isEmployer() &&
                        <Box
                            mt={2}
                        >
                            <StudentSelection employerId={uuid} />
                        </Box>
                    }

                </Box>

            </Container>
        </div>
    )
}