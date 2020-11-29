import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';

import InternshipOfferService from "../services/InternshipOfferService";

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

export default function InternshipOffer() {

    const { uuid } = useParams();
    const history = useHistory()

    const [offer, setOffer] = useState({});

    const fetch = () => {

        InternshipOfferService.find(uuid).then(response => {

            setOffer(response.data);

        })
    }

    const canApprove = () => {
        return offer.status == "PENDING_APPROVAL" && localStorage.getItem('UserType') === "ADMINISTRATOR";
    }

    const canReject = () => {
        return offer.status == "PENDING_APPROVAL" && localStorage.getItem('UserType') === "ADMINISTRATOR";
    }

    const translateStatus = (status) => {
        switch(status){
            case "PENDING_APPROVAL": return "En attente d'approbation";
            case "APPROVED": return "Approuvé";
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

                        <TableRow>
                            <TableCell align="left"><strong>Compagnie</strong></TableCell>
                            <TableCell align="right">{offer.company}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="left"><strong>Poste</strong></TableCell>
                            <TableCell align="right">{offer.jobTitle}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="left"><strong>Date Début</strong></TableCell>
                            <TableCell align="right">{new Date(offer.startDate).toLocaleDateString()}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="left"><strong>Date Fin</strong></TableCell>
                            <TableCell align="right">{new Date(offer.endDate).toLocaleDateString()}</TableCell>
                        </TableRow>

                        {
                            offer.salary &&
                            <TableRow>
                                <TableCell align="left"><strong>Salaire</strong></TableCell>
                                <TableCell align="right">{offer.salary.toFixed(2) + '$'} </TableCell>
                            </TableRow>
                        }

                        <TableRow>
                            <TableCell align="left"><strong>Heures Par Semaine</strong></TableCell>
                            <TableCell align="right">{offer.hours} </TableCell>
                        </TableRow>

                        <TableRow>
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
                        <Button
                            variant="contained" color="secondary"
                            size="small"
                            onClick={() => history.push(`/manage-access/${offer.uniqueId}`)}>
                            Gérer l'accès 
                        </Button>
                    }
                    {
                        canApprove() &&
                        <Button
                            variant="contained" color="secondary"
                            size="small"
                            onClick={() => history.push(`/manage-access/${offer.uniqueId}`)}>
                            Approuvé
                        </Button>
                    }
                    {
                        canReject() &&
                        <Button
                            variant="contained" color="secondary"
                            size="small"
                            onClick={() => history.push(`/manage-access/${offer.uniqueId}`)}>
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
        </div>
    )
}