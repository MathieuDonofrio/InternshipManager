import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import InternshipOfferService from "../services/InternshipOfferService";
import InternshipApplicationService from '../services/InternshipApplicationService';
import PortfolioService from '../services/PortfolioService';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
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

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

export default function InternshipOffer() {

    const { uuid } = useParams();
    const history = useHistory()

    const { enqueueSnackbar } = useSnackbar();

    const [offer, setOffer] = useState({});

    const [canApply, setCanApply] = useState(false);

    const [applicationDialogOpen, setApplicationDialogOpen] = React.useState(false);
    const [applicationDocuments, setApplicationDocuments] = React.useState([]);
    const [applicationDocumentsChecked, setApplicationDocumentsChecked] = React.useState([]);

    const fetch = () => {

        InternshipOfferService.find(uuid).then(response => {

            setOffer(response.data);

            if (offer.status == "APPROVED" && localStorage.getItem('UserType') == "STUDENT") {
                let userUniqueId = localStorage.getItem("UserUniqueId");

                InternshipOfferService.accessible(userUniqueId).then(response1 => {

                    if (response1.data.internshipOffers.filter(o => o.uniqueId == offer.uniqueId).size() >= 1) {
                        InternshipApplicationService.internshipApplications(userUniqueId).then(response2 => {

                            if (response2.data.applications.filter(a => a.offerUniqueId == offer.uniqueId).size() == 0) {
                                setCanApply(true);
                            }
                        })
                    }

                })
            }
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
            fetch();
            enqueueSnackbar("Application envoyée", { variant: 'success' });
        })

        setApplicationDialogOpen(false);
    }

    const approve = () => {
        InternshipOfferService.approve(uuid).then(response => {
            fetch();
            enqueueSnackbar(`Offre approuvé`, { variant: 'success' });
        });
    }

    const reject = () => {
        InternshipOfferService.reject(uuid).then(response => {
            fetch();
            enqueueSnackbar(`Offre rejeté`, { variant: 'success' });
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

    const translateStatus = (status) => {
        switch (status) {
            case "PENDING_APPROVAL": return "En attente d'approbation";
            case "APPROVED": return "En progres";
            case "REJECTED": return "Rejeté";
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

                    <Typography variant="h3">Offre de Stage</Typography>
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

                        <TableRow key="Company">
                            <TableCell align="left"><strong>Compagnie</strong></TableCell>
                            <TableCell align="right">{offer.company}</TableCell>
                        </TableRow>

                        <TableRow key="JobTitle">
                            <TableCell align="left"><strong>Poste</strong></TableCell>
                            <TableCell align="right">{offer.jobTitle}</TableCell>
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
                        <Box
                            marginTop={2}>
                            <Box
                                textAlign="center">
                                <Box
                                    marginBottom={1}
                                    style={{ backgroundColor: "lightgray" }}>
                                    <Typography>Portée De Travail</Typography>
                                </Box>
                            </Box>
                            <ul>{offer.jobScope.map(scope => (<li style={{}}>{scope}</li>))}</ul>
                        </Box>
                    }

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
                            Appliqué
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
                            onClick={approve}>
                            Approuvé
                        </Button>
                    }
                    {
                        canReject() &&
                        <Button
                            style={{ margin: '4px' }}
                            variant="contained" color="secondary"
                            size="small"
                            onClick={reject}>
                            Rejeté
                        </Button>
                    }
                </Box>

                <Box
                    marginTop={2}>

                    {
                        <Box
                            mt={2}
                        >

                        </Box>
                    }

                </Box>

            </Container>

            <Dialog
                open={applicationDialogOpen}
                onClose={closeApplicationDialog}
            >
                <DialogTitle>
                    Selectionné les documents a envoyée
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
                        Cancel
                    </Button>
                    <Button onClick={apply} color="primary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}