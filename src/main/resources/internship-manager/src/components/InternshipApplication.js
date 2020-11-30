import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import InternshipApplicationService from "../services/InternshipApplicationService";

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

export default function InternshipApplication() {

    const { uuid } = useParams();
    const history = useHistory()

    const { enqueueSnackbar } = useSnackbar();

    const [application, setApplication] = useState({});
    const [offer, setOffer] = useState({});

    const fetch = () => {

        InternshipApplicationService.find(uuid).then(response => {

            setApplication(response.data);
            setOffer(response.data.offer);

        })
    }

    const approve = () => {
        InternshipApplicationService.approve(uuid).then(response => {
            fetch();
            enqueueSnackbar(`Application approuvé`, { variant: 'success' });
        });
    }

    const reject = () => {
        InternshipApplicationService.reject(uuid).then(response => {
            fetch();
            enqueueSnackbar(`Application rejeté`, { variant: 'success' });
        });
    }

    const select = () => {
        InternshipApplicationService.select(uuid).then(response => {
            fetch();
            enqueueSnackbar(`Application selectionné`, { variant: 'success' });
        });
    }

    const canApprove = () => {
        return application.status == "PENDING_APPROVAL" && localStorage.getItem('UserType') === "ADMINISTRATOR";
    }

    const canReject = () => {
        return application.status == "PENDING_APPROVAL" && localStorage.getItem('UserType') === "ADMINISTRATOR";
    }

    const canSelect = () => {
        return application.status == "PENDING_APPROVAL" && localStorage.getItem('UniqueId') == offer.employerUniqueId;
    }

    const translateStatus = (status) => {
        switch (status) {
            case "PENDING_APPROVAL": return "En attente d'approbation";
            case "APPROVED": return "En attente de selection";
            case "REJECTED": return "Rejeté";
            case "SELECTED": return "Application selectionné!";
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

                    <Typography variant="h3">Application</Typography>
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
                            <TableCell align="left"><strong>Offre de stage</strong></TableCell>
                            <TableCell align="right">{offer.company + " | " + offer.jobTitle}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="left"><strong>Étudiant</strong></TableCell>
                            <TableCell align="right">{application.studentFirstName + " " + application.studentLastName}</TableCell>
                        </TableRow>

                    </Table>

                </Box>

                <Box
                    marginTop={2}
                    textAlign="center">
                    <Box
                        marginBottom={1}
                        style={{ backgroundColor: "lightsteelblue" }}>
                        <Typography>{translateStatus(application.status)}</Typography>
                    </Box>
                </Box>

                <Box
                    margin={2}
                    textAlign="center"
                >
                    {
                        canSelect() &&
                        <Button
                            variant="contained" color="secondary"
                            size="small"
                            onClick={select}>
                            Selectionné
                        </Button>
                    }
                    {
                        canApprove() &&
                        <Button
                            variant="contained" color="secondary"
                            size="small"
                            onClick={approve}>
                            Approuvé
                        </Button>
                    }
                    {
                        canReject() &&
                        <Button
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
        </div>
    )
}