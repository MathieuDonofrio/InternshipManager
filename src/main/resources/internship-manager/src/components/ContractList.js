import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ContractService from '../services/ContractService';
import CreateIcon from '@material-ui/icons/Create';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import { Divider } from "@material-ui/core";

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

const fakeRow = [
    { firstName: 'test', lastName: 'test', company: 'jeancoutu', jobTitle: 'developpeur' },
    { firstName: 'test', lastName: 'test', company: 'jeancoutu', jobTitle: 'developpeur' },
    { firstName: 'test', lastName: 'test', company: 'jeancoutu', jobTitle: 'developpeur' },
    { firstName: 'test', lastName: 'test', company: 'jeancoutu', jobTitle: 'developpeur' },
    { firstName: 'test', lastName: 'test', company: 'jeancoutu', jobTitle: 'developpeur' },
    { firstName: 'test', lastName: 'test', company: 'jeancoutu', jobTitle: 'developpeur' },
]

export default function ContractList() {

    const history = useHistory();
    const classes = useStyles();
    const classes2 = useStyles2();

    const [rows, setRows] = useState([]);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const fetchAllUsers = async () => {
        const response = await ContractService.awaitingSignature(localStorage.getItem('UserUniqueId'));
        console.log(response.data);
        setRows(response.data.contracts);
    }

    useEffect(() => { fetchAllUsers(); }, [])

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
                    <Tab label="tous"/>
                    <Tab label="signé"/>
                    <Tab label="non signé"/>
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
                            <TableCell align="center"><strong>Détails</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((contract, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ verticalAlign: 'top' }} align="center">{contract.application.studentFirstName + " " + contract.application.studentLastName} </TableCell>
                                <TableCell component="th" scope="row" style={{ verticalAlign: 'top' }} align="left">
                                    <p><strong>Compagnie: </strong>{contract.application.company}</p>
                                    <p><strong>Titre de poste: </strong>{contract.application.jobTitle}</p>
                                    <p><strong>Date: </strong>{new Date(contract.creationDate).toDateString()}</p>
                                </TableCell>
                                <TableCell align="center" style={{ verticalAlign: 'top' }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <Button
                                            variant="contained" color="secondary"
                                            size="small"
                                            startIcon={<CreateIcon />}
                                        >
                                            Signer
                                        </Button>
                                    </div>
                                    <div>

                                        <Button
                                            variant="contained" color="secondary"
                                            size="small"
                                            startIcon={<CloudDownloadIcon />}
                                        >
                                            Télécharger
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}