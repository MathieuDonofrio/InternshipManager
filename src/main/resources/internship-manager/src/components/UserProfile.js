import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';

import UserService from "../services/UserService";
import InternshipApplicationService from '../services/InternshipApplicationService';
import InternshipOfferService from '../services/InternshipOfferService';
import PortfolioService from '../services/PortfolioService';

import BackButton from "./BackButton";

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function UserProfile() {

    const { uuid } = useParams();
    const history = useHistory()

    const [user, setUser] = useState({});

    const [applications, setApplications] = useState([]);
    const [offers, setOffers] = useState([]);
    const [documents, setDocuments] = useState([]);

    const fetch = () => {

        UserService.find(uuid).then(response => {

            setUser(response.data);

            if (response.data.type == "STUDENT") {


                InternshipApplicationService.internshipApplications(uuid).then(response1 => {

                    setApplications(response1.data.applications);
                })

                PortfolioService.portfolioDocuments(uuid).then(response1 => {

                    setDocuments(response1.data.portfolioDocuments);
                })
            }


            if (response.data.type == "EMPLOYER") {

                InternshipOfferService.findAllByEmployer(uuid).then(response1 => {

                    setOffers(response1.data.internshipOffers);
                })

            }

        });
    }

    const isStudent = () => { return user.type == "STUDENT"; };

    const isEmployer = () => { return user.type == "EMPLOYER"; };

    const isCurrentUser = () => { return uuid === localStorage.getItem("UserUniqueId"); };

    const canSeeOffers = () => { return isEmployer() && localStorage.getItem("UserType") != "STUDENT"; };

    const translateType = (type) => {
        switch (type) {
            case "STUDENT": return "Étudiant";
            case "EMPLOYER": return "Employé";
            case "ADMINISTRATOR": return "Administrateur";
        }
    }

    useEffect(() => { fetch(); }, [])

    return (
        <div>

            {
                !isCurrentUser() &&
                <BackButton/>
            }

            {
                isCurrentUser() &&
                <Box paddingTop={2}></Box>
            }

            <Container>
                <Box
                    margin={2}
                    textAlign="center">

                    <Typography variant="h3">{user.firstName + ' ' + user.lastName}</Typography>
                    <Typography
                        style={{ color: "gray" }}
                        variant="subtitle1">{uuid}</Typography>
                </Box>

                <Box
                    marginTop={2}
                    textAlign="center">
                    <Box
                        marginBottom={1}
                        style={{ backgroundColor: "lightsteelblue" }}>
                        <Typography>Inscrit</Typography>
                    </Box>
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
                                <TableCell align="left"><strong>Compagnie</strong></TableCell>
                                <TableCell align="right">{user.company}</TableCell>
                            </TableRow>
                        }

                        {
                            isEmployer() &&
                            <TableRow>
                                <TableCell align="left"><strong>Téléphone</strong></TableCell>
                                <TableCell align="right">{user.phone}</TableCell>
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


                {
                    isStudent() &&
                    <div>
                        <Box
                            marginTop={2}
                            textAlign="center"
                            style={{ backgroundColor: "lightgray" }}>
                            <Typography>Documents de portfolio</Typography>
                        </Box>

                        <div>
                            {
                                documents.length > 0 &&
                                <TableContainer>
                                    <Table size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width="30%" align="center"><strong>Type</strong></TableCell>
                                                <TableCell width="30%" align="center"><strong>Fichier</strong></TableCell>
                                                <TableCell width="30%" align="center"><strong>Action</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {documents.map((document, index) => (
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row" align="center">{document.type}</TableCell>
                                                    <TableCell component="th" scope="row" align="center">{document.fileName}</TableCell>
                                                    <TableCell component="th" scope="row" align="center">
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() => history.push(`/portfolio-document/${document.uniqueId}`)}
                                                        >
                                                            voir
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                            {
                                documents.length == 0 &&
                                <Box
                                    margin={2}>
                                    <Typography>Aucun document!</Typography>
                                </Box>
                            }
                        </div>

                    </div>
                }

                {
                    isStudent() &&
                    <div>
                        <Box
                            marginTop={2}
                            textAlign="center"
                            style={{ backgroundColor: "lightgray" }}>
                            <Typography>Applications</Typography>
                        </Box>

                        <div>
                            {
                                applications.length > 0 &&
                                <TableContainer>
                                    <Table size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width="30%" align="center"><strong>Compagnie</strong></TableCell>
                                                <TableCell width="30%" align="center"><strong>Titre du poste</strong></TableCell>
                                                <TableCell width="30%" align="center"><strong>Action</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {applications.map((application, index) => (
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row" align="center">{application.company}</TableCell>
                                                    <TableCell component="th" scope="row" align="center">{application.jobTitle}</TableCell>
                                                    <TableCell component="th" scope="row" align="center">
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() => history.push(`/internship-application/${application.uniqueId}`)}
                                                        >
                                                            voir
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                            {
                                applications.length == 0 &&
                                <Box
                                    margin={2}>
                                    <Typography>Aucune application!</Typography>
                                </Box>
                            }
                        </div>
                    </div>
                }

                {
                    canSeeOffers() &&
                    <div>
                        <Box
                            marginTop={2}
                            textAlign="center"
                            style={{ backgroundColor: "lightgray" }}>
                            <Typography>Offres de stage</Typography>
                        </Box>

                        <div>
                            {
                                offers.length > 0 &&
                                <TableContainer>
                                    <Table size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width="30%" align="center"><strong>Compagnie</strong></TableCell>
                                                <TableCell width="30%" align="center"><strong>Titre du poste</strong></TableCell>
                                                <TableCell width="30%" align="center"><strong>Action</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {offers.map((offer, index) => (
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
                            }
                            {
                                offers.length == 0 &&
                                <Box
                                    margin={2}>
                                    <Typography>Aucune offre!</Typography>
                                </Box>
                            }
                        </div>
                    </div>
                }

            </Container>

            <Box paddingTop={2}></Box>
        </div>
    )
}