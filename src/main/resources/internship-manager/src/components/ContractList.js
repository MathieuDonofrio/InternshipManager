import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import SignatureService from "../services/SignatureService";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, Paper, Tab, Tabs } from "@material-ui/core";
import ContractService from '../services/ContractService';

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

export default function ContractList() {

    const classes = useStyles();
    const history = useHistory();
    const classes2 = useStyles2();
    const [value, setValue] = React.useState(0);
    const [rows, setRows] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    const fetchAllContracts = async () => {
        const response = await ContractService.allContracts(localStorage.getItem('UserUniqueId'));
        setRows(response.data.contracts);
    }
    
    const fetchAllSignedContracts = async () => {
        const response = await ContractService.signedContracts(localStorage.getItem('UserUniqueId'));
        setRows(response.data.contracts);
    }

    const fetchAllAwaitingSignature = async () => {
        const response = await ContractService.awaitingSignature(localStorage.getItem('UserUniqueId'));
        setRows(response.data.contracts);
    }

    useEffect(() => { fetchAllContracts(); }, [])

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
                    <Tab label="tous" onClick={() => fetchAllContracts()} />
                    <Tab label="avec signature" onClick={() => fetchAllSignedContracts()} />
                    <Tab label="à signer" onClick={() => fetchAllAwaitingSignature()} />
                </Tabs>
            </Paper>
            <Container>
                <Box
                    mb={2}
                    paddingTop={2}
                    textAlign="center">

                    <Typography component="h1" variant="h4">Contrats</Typography>
                </Box>
            </Container>

            <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><strong>Étudiant</strong></TableCell>
                            <TableCell align="center"><strong>Compagnie</strong></TableCell>
                            <TableCell align="center"><strong>Titre de poste</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((contract, index) => (
                            <TableRow key={index}>

                                <TableCell align="center">{contract.application.studentFirstName + " " + contract.application.studentLastName} </TableCell>
                                <TableCell align="center">{contract.application.company} </TableCell>
                                <TableCell align="center">{contract.application.jobTitle} </TableCell>
                                
                                <TableCell align="center">
                                        <Button
                                            variant="contained" color="secondary"
                                            size="small"
                                            onClick={() => history.push(`/contract/${contract.uniqueId}`)}
                                        >
                                            Voir
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