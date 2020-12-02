import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import ContractService from '../services/ContractService'
import SignatureService from "../services/SignatureService";
import UserService from "../services/UserService";

import BackButton from "./BackButton";

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Link from '@material-ui/core/Link';

export default function Contract() {

    const { uuid } = useParams();
    const history = useHistory()

    const { enqueueSnackbar } = useSnackbar();

    const [contract, setContract] = useState({});
    const [application, setApplication] = useState();
    const [student, setStudent] = useState();
    const [employer, setEmployer] = useState();
    const [administrator, setAdministrator] = useState();

    const [canSign, setCanSign] = useState(false);

    const [url, setUrl] = useState(null);

    const fetch = () => {

        setUrl(null);
        
        ContractService.find(uuid).then(response => {

            setContract(response.data);
            setApplication(response.data.application);

            setCanSign(localStorage.getItem("UserUniqueId") === response.data.currentUserUniqueId);

            UserService.find(response.data.application.studentUniqueId).then(response1 => {
                setStudent(response1.data);
            })

            UserService.find(response.data.application.employerUniqueId).then(response1 => {
                setEmployer(response1.data);
            })

            UserService.find(response.data.administrator.uniqueId).then(response1 => {
                setAdministrator(response1.data);
            })

        });

        ContractService.generate(uuid).then(response => {

            let blob = new Blob([response.data], { type: response.headers['content-type'] });

            setUrl(URL.createObjectURL(blob));
        });
    }

    const sign = () => {

        let userUniqueId = localStorage.getItem("UserUniqueId");

        SignatureService.find(userUniqueId).then(data => {

            if (data.data) {

                ContractService.sign(uuid).then(() => {
                    fetch();
                    enqueueSnackbar("Contrat Signé", { variant: 'success' });
                });

            } else {
                enqueueSnackbar("Vous n'avez pas de signature!", { variant: 'error' });
            }

        });
    }

    const translateSession = (session) => {

        if (session) {

            let translated = "";

            let split = session.split('-');

            switch (split[0]) {
                case "AUTUMN": translated += "Automne"; break;
                case "WINTER": translated += "Hiver"; break;
                case "SUMMER": translated += "Été"; break;
            }

            translated += " " + split[1];

            return translated
        }
    }

    const formattedStatus = () => {

        switch (contract.status) {
            case "STUDENT": return "En attente de la signature de l'étudiant";
            case "EMPLOYER": return "En attente de la signature de l'employeur";
            case "ADMINISTRATOR": return "En attente de la signature du gestionaire de stage";
            case "COMPLETED": return "Contrat complet!";
        }
    }

    const progress = () => {
        switch (contract.status) {
            case "STUDENT": return 25;
            case "EMPLOYER": return 50;
            case "ADMINISTRATOR": return 75;
            case "COMPLEATED": return 100;
        }
    }

    useEffect(() => { fetch(); }, [])

    return (
        <div>
            <BackButton/>

            <Container>
                <Box
                    margin={2}
                    textAlign="center">

                    <Typography variant="h3">Contrat</Typography>
                    <Typography
                        style={{color: "gray"}}
                        variant="subtitle1">{contract.uniqueId}</Typography>
                </Box>

                <Box
                    marginTop={2}
                    textAlign="center">
                    <Box
                        marginBottom={1}
                        style={{backgroundColor: "lightsteelblue"}}>
                        <Typography>{formattedStatus()}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={progress()} />
                </Box>

                <Box
                    margin={2}
                    textAlign="center"
                >
                    {
                        canSign && <Button
                            variant="contained" color="secondary"
                            size="small"
                            onClick={() => sign()}
                        >
                            Signer
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

                        <TableRow key="session">
                            <TableCell align="left"><strong>Session</strong></TableCell>
                            <TableCell align="right">{translateSession(contract.semester)}</TableCell>
                        </TableRow>

                        <TableRow key="application">
                            <TableCell align="left"><strong>Application</strong></TableCell>
                            <TableCell align="right">
                                {
                                    application &&

                                    <Link
                                        onClick={() => history.push(`/internship-application/${application.uniqueId}`)}>
                                        {application.company + " | " + application.jobTitle}
                                    </Link>
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow key="student">
                            <TableCell align="left"><strong>Étudiant</strong></TableCell>
                            <TableCell align="right">
                                {
                                    student &&

                                    <Link
                                        onClick={() => history.push(`/user/${student.uniqueId}`)}>
                                        {student.firstName + " " + student.lastName}
                                    </Link>
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow key="employer">
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

                        <TableRow key="administrator">
                            <TableCell align="left"><strong>Administrateur</strong></TableCell>
                            <TableCell align="right">
                                {
                                    administrator &&

                                    <Link
                                        onClick={() => history.push(`/user/${administrator.uniqueId}`)}>
                                        {administrator.firstName + " " + administrator.lastName}
                                    </Link>
                                }
                            </TableCell>
                        </TableRow>
                    </Table>

                </Box>

                <Box
                    marginTop={2}
                    textAlign="center"
                    style={{ backgroundColor: "lightgray" }}>
                    <Typography>Visualisation</Typography>
                </Box>

                <Box
                    marginTop={2}
                    marginBottom={2}
                    border="1px solid black">
                        <iframe src={url} width="100%" height="800px"></iframe>
                </Box>

                <Box paddingTop={2}></Box>

            </Container>
        </div>
    )
}