import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import InternshipOfferService from "../services/InternshipOfferService";
import InternshipApplicationService from '../services/InternshipApplicationService';
import PortfolioService from '../services/PortfolioService';
import UserService from '../services/UserService';

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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Link from '@material-ui/core/Link';

export default function InternshipOffer() {

    const { uuid } = useParams();
    const history = useHistory()

    const { enqueueSnackbar } = useSnackbar();

    const [offer, setOffer] = useState({});
    const [employer, setEmployer] = useState();
    const [applications, setApplications] = useState([]);

    const [canApply, setCanApply] = useState(false);

    const [applicationDialogOpen, setApplicationDialogOpen] = React.useState(false);
    const [applicationDocuments, setApplicationDocuments] = React.useState([]);
    const [applicationDocumentsChecked, setApplicationDocumentsChecked] = React.useState([]);

    const fetch = () => {

        InternshipOfferService.find(uuid).then(response => {

            setOffer(response.data);

            if (response.data.status == "APPROVED" && localStorage.getItem('UserType') == "STUDENT") {

                let userUniqueId = localStorage.getItem("UserUniqueId");

                // Verify is has not applied before
                InternshipApplicationService.internshipApplications(userUniqueId).then(response1 => {

                    if (response1.data.applications.filter(a => a.offerUniqueId == uuid).length == 0) {
                        setCanApply(true);
                    }
                })
            }

            UserService.find(response.data.employer).then(response1 => {
                setEmployer(response1.data);
            })

            InternshipApplicationService.findByOffer(response.data.uniqueId).then(response1 => {
                setApplications(response1.data.applications);
            })
        })
    }

    const openApplicationDialog = () => {

        const userUniqueId = localStorage.getItem("UserUniqueId");

        PortfolioService.approved(userUniqueId).then(response => {
            setApplicationDocuments(response.data.portfolioDocuments);
            setApplicationDialogOpen(true);
        });
    };

    const closeApplicationDialog = () => {

        setApplicationDialogOpen(false);
    };


    const toggleApplicationDocumentCheck = (value) => () => {
        const currentIndex = applicationDocumentsChecked.indexOf(value);
        const newChecked = [...applicationDocumentsChecked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setApplicationDocumentsChecked(newChecked);
    };

    const apply = () => {

        const documents = applicationDocumentsChecked.map(applicationDocuments => applicationDocuments.uniqueId);

        const request = {
            offerUniqueId: uuid,
            documents: documents,
        }

        InternshipApplicationService.createInternshipApplication(request).then(response => {
            setCanApply(false);
            fetch();
            enqueueSnackbar("Application envoyée", { variant: 'success' });
        })

        setApplicationDialogOpen(false);
    }

    const approve = () => {

        InternshipOfferService.approve(uuid).then(response => {
            fetch();
            enqueueSnackbar(`Offre approuvée`, { variant: 'success' });
        });
    }

    const reject = () => {
        InternshipOfferService.reject(uuid).then(response => {
            fetch();
            enqueueSnackbar(`Offre rejetée`, { variant: 'success' });
        });
    }

    const canApprove = () => {
        return offer.status == "PENDING_APPROVAL" && localStorage.getItem('UserType') === "ADMINISTRATOR";
    }

    const canReject = () => {
        return offer.status == "PENDING_APPROVAL" && localStorage.getItem('UserType') === "ADMINISTRATOR";
    }

    const canManageAccess = () => {
        return localStorage.getItem('UserType') === "ADMINISTRATOR";
    }

    const canSeeApplications = () => {
        return localStorage.getItem('UserType') !== "STUDENT";
    }

    const translateStatus = (status) => {
        switch (status) {
            case "PENDING_APPROVAL": return "En attente d'approbation";
            case "APPROVED": return "En progrès";
            case "REJECTED": return "Rejeté";
        }
    }

    useEffect(() => { fetch(); }, [])

    return (
        <div>
            <BackButton />

            <Container>
                <Box
                    margin={2}
                    textAlign="center">

                    <Typography variant="h3">Offre de Stage</Typography>
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
                        <Typography>{translateStatus(offer.status)}</Typography>
                    </Box>
                </Box>


                <Box
                    margin={2}
                    textAlign="center"
                >
                    {
                        canApply &&
                        <Button
                            style={{ margin: '4px' }}
                            variant="contained" color="secondary"
                            size="small"
                            onClick={openApplicationDialog}>
                            Appliquer
                        </Button>
                    }
                    {
                        canManageAccess() &&
                        <Button
                            style={{ margin: '4px' }}
                            variant="contained" color="secondary"
                            size="small"
                            onClick={() => history.push(`/manage-access/${offer.uniqueId}`)}>
                            Gérer l'accès
                        </Button>
                    }
                    {
                        canApprove() &&
                        <Button
                            style={{ margin: '4px' }}
                            variant="contained" color="secondary"
                            size="small"
                            onClick={() => approve()}>
                            Approuvé
                        </Button>
                    }
                    {
                        canReject() &&
                        <Button
                            style={{ margin: '4px' }}
                            variant="contained" color="secondary"
                            size="small"
                            onClick={() => reject()}>
                            Rejeté
                        </Button>
                    }
                </Box>

                <Box
                    marginTop={2}
                    textAlign="center"
                    style={{ backgroundColor: "lightgray" }}>
                    <Typography>Informations Générales</Typography>
                </Box>

                <Box>

                    <Table size="small">

                        <TableHead>
                            <TableCell width="30%"></TableCell>
                            <TableCell width="70%"></TableCell>
                        </TableHead>

                        <TableRow key="Company">
                            <TableCell align="left"><strong>Compagnie</strong></TableCell>
                            <TableCell align="right">{offer.company}</TableCell>
                        </TableRow>

                        <TableRow key="JobTitle">
                            <TableCell align="left"><strong>Poste</strong></TableCell>
                            <TableCell align="right">{offer.jobTitle}</TableCell>
                        </TableRow>


                        <TableRow key="JobTitle">
                            <TableCell align="left"><strong>Employeur</strong></TableCell>
                            <TableCell align="right">
                                {
                                    employer &&
                                    <Link
                                        onClick={() => history.push(`/user/${employer.uniqueId}`)}>
                                        {employer.firstName + " " + employer.lastName}
                                    </Link>
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow key="JobTitle">
                            <TableCell align="left"><strong>Téléphone</strong></TableCell>
                            <TableCell align="right">{offer.phone}</TableCell>
                        </TableRow>

                        <TableRow key="StartDate">
                            <TableCell align="left"><strong>Date Début</strong></TableCell>
                            <TableCell align="right">{new Date(offer.startDate).toLocaleDateString()}</TableCell>
                        </TableRow>

                        <TableRow key="EndDate">
                            <TableCell align="left"><strong>Date Fin</strong></TableCell>
                            <TableCell align="right">{new Date(offer.endDate).toLocaleDateString()}</TableCell>
                        </TableRow>

                        {
                            offer.salary &&
                            <TableRow key="Salary">
                                <TableCell align="left"><strong>Salaire</strong></TableCell>
                                <TableCell align="right">{offer.salary.toFixed(2) + '$'} </TableCell>
                            </TableRow>
                        }

                        <TableRow key="Hours">
                            <TableCell align="left"><strong>Heures Par Semaine</strong></TableCell>
                            <TableCell align="right">{offer.hours} </TableCell>
                        </TableRow>

                        <TableRow key="Schedule">
                            <TableCell align="left"><strong>Horaire</strong></TableCell>
                            {
                                offer.schedule && <TableCell align="right">{offer.schedule}</TableCell>
                            }
                            {
                                !offer.schedule && <TableCell align="right">Aucun horaire specifié</TableCell>
                            }
                        </TableRow>

                    </Table>

                    {
                        offer.jobScope &&
                        <Box>
                            <Box
                                marginTop={2}
                                textAlign="center"
                                style={{ backgroundColor: "lightgray" }}>
                                <Typography>Portée De Travail</Typography>
                            </Box>

                            <Box
                                marginTop={2}>
                                <ul>{offer.jobScope.map(scope => (<li style={{}}>{scope}</li>))}</ul>
                            </Box>

                        </Box>
                    }

                </Box>

                {
                    offer.status != "PENDING_APPROVAL" && canSeeApplications() &&
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
                                                <TableCell width="30%" align="center"><strong>Étudiant</strong></TableCell>
                                                <TableCell width="30%" align="center"><strong>Date</strong></TableCell>
                                                <TableCell width="30%" align="center"><strong>Action</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {applications.map((application, index) => (
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row" align="center">{application.studentFirstName + " " + application.studentLastName}</TableCell>
                                                    <TableCell component="th" scope="row" align="center">{new Date(application.date).toLocaleDateString()}</TableCell>
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

                <Box paddingTop={2}></Box>

            </Container>

            <Dialog
                open={applicationDialogOpen}
                onClose={closeApplicationDialog}
            >
                <DialogTitle>
                    Sélectionnez les documents à envoyer
                </DialogTitle>
                <DialogContent>
                    <List>
                        {applicationDocuments.length > 0 && applicationDocuments.map((value) => {

                            const labelId = `checkbox-list-label-${value}`;

                            return (
                                <ListItem key={value} role={undefined} dense button onClick={toggleApplicationDocumentCheck(value)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={applicationDocumentsChecked.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={value.fileName} />
                                </ListItem>
                            );
                        })}
                        {applicationDocuments.length == 0 &&
                            <ListItem key={1}>
                                <ListItemText primary={'No documents!'} />
                            </ListItem>
                        }
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={closeApplicationDialog} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={apply} color="primary">
                        Appliquer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}