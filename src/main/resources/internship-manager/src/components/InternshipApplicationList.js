import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { AppBar, Box, makeStyles, Paper, Tab, Tabs } from "@material-ui/core";
import InternshipApplicationService from '../services/InternshipApplicationService';
import { useHistory } from "react-router-dom";

//
// Data
//

const useStyles = makeStyles({
    table: {
        minWidth: 600,
    },
});

const useStyles2 = makeStyles({
    root: {
        flexGrow: 1,
    },
});

export default function InternshipApplicationList() {
    const [rows, setRows] = useState([]);
    const [value, setValue] = useState(0);
    const [title, setTitle] = useState('');
    const history = useHistory();
    const classes = useStyles();
    const classes2 = useStyles2();

    //
    // Event Handlers
    //

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const isStudent = () => {
        return localStorage.getItem('UserType') === "STUDENT";
    }

    const isAdministrator = () => {
        return localStorage.getItem('UserType') === "ADMINISTRATOR";
    }

    const fetchStudentApplications = async () => {

        let userId = localStorage.getItem("UserUniqueId");

        const response = await InternshipApplicationService.internshipApplications(userId);

        setRows(response.data.applications);

        setTitle('Applications');
    }
    
    const fetchApprovedApplications = async () => {

        const response = await InternshipApplicationService.approved();

        setRows(response.data.applications);

        setTitle('Applications approuvées');
    }
    
    const fetchPendingApplications = async () => {

        const response = await InternshipApplicationService.pendingApproval();

        setRows(response.data.applications);

        setTitle('Applications en attentes');
    }
    
    const fetchRejectedApplications = async () => {

        const response = await InternshipApplicationService.rejected();

        setRows(response.data.applications);

        setTitle('Applications rejetées');
    }
    
    const fetchSelectedApplications = async () => {

        const response = await InternshipApplicationService.selected();

        setRows(response.data.applications);
        
        setTitle('Applications sélectionnées');
    }

    const fetchApplicationList = () => {

        if (isAdministrator())
            fetchPendingApplications();
        else
            fetchStudentApplications();
    }

    useEffect(() => { fetchApplicationList() }, [])

    return (
        <div>
            <AppBar position="static" color="default">
                {isAdministrator() &&
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="en attente" onClick={() => fetchPendingApplications() } />
                        <Tab label="approuvé" onClick={() => fetchApprovedApplications()} />
                        <Tab label="sélectionner" onClick={() => fetchSelectedApplications() } />
                        <Tab label="rejeté" onClick={() => fetchRejectedApplications() } />
                    </Tabs>
                }

                {isStudent() &&
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="mes applications" onClick={() => fetchStudentApplications()} />
                    </Tabs>
                }
            </AppBar>
            <Container>
                <Box
                    mb={2}
                    paddingTop={2}
                    textAlign="center">

                    <Typography component="h1" variant="h4">{title}</Typography>
                </Box>
            </Container>
            {rows.length == 0 &&
                <Container>
                    <Box
                        mb={2}
                        paddingTop={2}
                        paddingBottom={2}
                        textAlign="center">

                        <Typography >Pas d'application pour vous</Typography>
                    </Box>
                </Container>
            }
            {rows.length > 0 &&

                <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><strong>Student Name</strong></TableCell>
                                <TableCell align="center"><strong>Compagnie</strong></TableCell>
                                <TableCell align="center"><strong>Job Title</strong></TableCell>
                                <TableCell align="center"><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((application, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{application.studentFirstName + " " + application.studentLastName}</TableCell>
                                    <TableCell align="center">{application.company}</TableCell>
                                    <TableCell align="center">{application.jobTitle}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained" color="primary"
                                            size="small"
                                            onClick={() => history.push(`/internship-application/${application.uniqueId}`)}
                                        >
                                            Voir
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </div>
    )
}