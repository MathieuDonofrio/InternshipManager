import React, { useEffect, useState } from "react";
import InternshipOfferService from "../services/InternshipOfferService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { AppBar, Divider, makeStyles } from "@material-ui/core";
import { Box, Paper, Tab, Tabs } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import InternshipApplicationService from "../services/InternshipApplicationService";

//
// Data
//

const useStyles2 = makeStyles({
    root: {
        flexGrow: 1,
    },
});

export default function InternshipOfferList() {
    const [rows, setRows] = useState([]);
    const [value, setValue] = useState(0);
    const [title, setTitle] = useState('');
    const history = useHistory();
    const classes2 = useStyles2();

    //
    // Event Handlers
    //

    const isStudent = () => {
        return localStorage.getItem('UserType') === "STUDENT";
    }

    const isEmployer = () => {
        return localStorage.getItem('UserType') === "EMPLOYER";
    }

    const isAdministrator = () => {
        return localStorage.getItem('UserType') === "ADMINISTRATOR";
    }


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //
    // Admin Services 
    //

    const fetchPendingApproval = async () => {

        const response = await InternshipOfferService.pendingApproval();

        setRows(response.data.internshipOffers);

        setTitle('Offres en attente');
    }

    const fetchApproved = async () => {

        const response = await InternshipOfferService.approved();

        setRows(response.data.internshipOffers);

        setTitle('Offres approuvé');
    }

    //
    // Employer Services
    //

    const findAllApprovedByEmployer = async () => {

        let uuid = localStorage.getItem("UserUniqueId");

        const response = await InternshipOfferService.findAllByEmployer(uuid);

        setRows(response.data.internshipOffers);

        setTitle('Offres approuvé');
    }

    const findAllPendingByEmployer = async () => {

        let uuid = localStorage.getItem("UserUniqueId");

        const response = await InternshipOfferService.findAllPendingByEmployer(uuid);

        setRows(response.data.internshipOffers);

        setTitle('Offres en attentes');
    }

    const findAllRejectedByEmployer = async () => {

        let uuid = localStorage.getItem("UserUniqueId");

        const response = await InternshipOfferService.findAllRejectedByEmployer(uuid);

        setRows(response.data.internshipOffers);

        setTitle('Offres rejeté');
    }

    //
    // Student Services
    //

    const fetchStudentAppliableInternshipOffers = async () => {

        let uuid = localStorage.getItem("UserUniqueId");

        const response1 = await InternshipOfferService.accessible(uuid);
        const response2 = await InternshipApplicationService.internshipApplications(uuid);

        const offers = response1.data.internshipOffers.filter(offer =>
            !response2.data.applications.some(app => app.offerUniqueId == offer.uniqueId));

        setRows(offers);

        setTitle('Offres applicables');
    }

    const fetchStudentAppliedInternshipOffers = async () => {

        let uuid = localStorage.getItem("UserUniqueId");

        const response1 = await InternshipOfferService.accessible(uuid);
        const response2 = await InternshipApplicationService.internshipApplications(uuid);

        const offers = response1.data.internshipOffers.filter(offer =>
            response2.data.applications.some(app => app.offerUniqueId == offer.uniqueId));

        setRows(offers);
        
        setTitle('Offres appliquées');
    }

    const fetchOfferList = () => {

        if (isAdministrator())
            fetchApproved();
        else if (isEmployer())
            findAllApprovedByEmployer();
        else
            fetchStudentAppliableInternshipOffers();
    }

    useEffect(() => { fetchOfferList() }, [])

    //
    // Rendering
    //

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
                        <Tab label="approuvée" onClick={() => fetchApproved()} />
                        <Tab label="en attente" onClick={() => fetchPendingApproval()} />
                    </Tabs>
                }

                {isEmployer() &&
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="approuvée" onClick={() => findAllApprovedByEmployer()} />
                        <Tab label="en attente" onClick={() => findAllPendingByEmployer()} />
                        <Tab label="rejeté" onClick={() => findAllRejectedByEmployer()} />
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
                        <Tab label="applicable" onClick={() => fetchStudentAppliableInternshipOffers()} />
                        <Tab label="appliquée" onClick={() => fetchStudentAppliedInternshipOffers()} />
                    </Tabs>
                }
            </AppBar>

            <Divider/>

            <Container>
                <Box
                    mb={2}
                    paddingTop={2}
                    textAlign="left"
                >
                    <Typography component="h1" variant="h4" align="center">
                        {title}
                    </Typography>
                </Box>
            </Container>

            <TableContainer>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell width="30%" align="center"><strong>Compagnie</strong></TableCell>
                            <TableCell width="30%" align="center"><strong>Titre de poste</strong></TableCell>
                            <TableCell width="30%" align="center"><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((offer, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row" align="center">{offer.company}</TableCell>
                                <TableCell component="th" scope="row" align="center">{offer.jobTitle}</TableCell>
                                <TableCell component="th" scope="row" align="center">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => history.push(`/internship-offer/${offer.uniqueId}`)}
                                    >
                                        voir
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}