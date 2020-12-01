import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import PortfolioService from "../services/PortfolioService";

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
//import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
//import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
//import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

export default function PortfolioDocument() {

    const { uuid } = useParams();
    const history = useHistory()

    const { enqueueSnackbar } = useSnackbar();

    const [document, setDocument] = useState({});
    const [url, setUrl] = useState(null);

    const fetch = () => {

        PortfolioService.find(uuid).then(response => {
            setDocument(response.data);
        });

        PortfolioService.download(uuid).then(response => {
            let blob = new Blob([response.data], { type: response.headers['content-type'] });
            setUrl(URL.createObjectURL(blob));
        });
    }

    const approve = () => {

        PortfolioService.approve(uuid).then(() => {
            fetch()
            enqueueSnackbar(`Document de portfolio apprové`,  { variant: 'success' });
        });
    }

    const canApprove = () => {
        return !document.approved && localStorage.getItem('UserType') === "ADMINISTRATOR";
    }

    const translateType = (type) => {
        switch (type) {
            case "Resume": return "Curriculum Vitae";
            case "Cover Letter": return "Lettre de motivation";
            case "Grades": return "Bulletin";
            case "Other": return "Autre";
        }
    }

    const formattedStatus = () => {
        if (document.approved) return "Le document est approuvé!";
        else return "En attente d'approbation"
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

                    <Typography variant="h3">Document de Portfolio</Typography>
                    <Typography
                        style={{ color: "gray" }}
                        variant="subtitle1">{document.uniqueId}</Typography>
                </Box>

                <Box>

                    <Table size="small">

                        <TableHead>
                            <TableCell width="30%"></TableCell>
                            <TableCell width="70%"></TableCell>
                        </TableHead>

                        <TableRow>
                            <TableCell align="left"><strong>Nom</strong></TableCell>
                            <TableCell align="right">{document.fileName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><strong>Type</strong></TableCell>
                            <TableCell align="right">{translateType(document.type)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><strong>Date de téléversement</strong></TableCell>
                            <TableCell align="right">{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                    </Table>

                </Box>

                <Box
                    marginTop={2}
                    textAlign="center">
                    <Box
                        marginBottom={1}
                        style={{ backgroundColor: "lightsteelblue" }}>
                        <Typography>{formattedStatus()}</Typography>
                    </Box>
                </Box>

                <Box
                    margin={2}
                    textAlign="center"
                >
                    {
                        canApprove() && <Button
                            variant="contained" color="secondary"
                            size="small"
                            onClick={approve}
                        >
                            Approuvé
                        </Button>
                    }
                </Box>

                <Box
                    marginTop={2}
                    border="1px solid black">
                    <iframe src={url} width="100%" height="800px">
                    </iframe>
                </Box>

            </Container>
        </div>
    )
}