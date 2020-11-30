import React, {useEffect, useState } from "react";
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
import { makeStyles } from "@material-ui/core";
import { Box, Paper, Tab, Tabs } from "@material-ui/core";
import { useHistory } from "react-router-dom";

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
    const history = useHistory();
    const classes2 = useStyles2();

    //
    // Event Handlers
    //

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const fetchPendingApproval = async () => {
        const response = await InternshipOfferService.pendingApproval();
        setRows(response.data.internshipOffers);
    }

    const fetchApproved = async () => {
        const response = await InternshipOfferService.approved();
        setRows(response.data.internshipOffers);
    }

    useEffect(() => { fetchApproved(); }, [])

    //
    // Rendering
    //

    return (
        <div>
            <Paper className={classes2.root}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="tous" onClick={() =>{console.log("im not yet implemented");}} />
                    <Tab label="approuvé" onClick={() => fetchApproved()} />
                    <Tab label="en Attente" onClick={() => fetchPendingApproval()} />
                </Tabs>
            </Paper>
            <Container>
                <Box
                    mb={2}
                    paddingTop={2}
                    textAlign="left"
                >
                    <Typography component="h1" variant="h4" align="center">Offres en attentes</Typography>
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
                                     >voir</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}