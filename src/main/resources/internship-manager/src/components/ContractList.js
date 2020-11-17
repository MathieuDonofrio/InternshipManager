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
import UserService from '../services/UserService'
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

const fakeRow = [
    {firstName: 'test',lastName:'test',company:'jeancoutu',jobTitle:'developpeur'},
    {firstName: 'test',lastName:'test',company:'jeancoutu',jobTitle:'developpeur'},
    {firstName: 'test',lastName:'test',company:'jeancoutu',jobTitle:'developpeur'},
    {firstName: 'test',lastName:'test',company:'jeancoutu',jobTitle:'developpeur'},
    {firstName: 'test',lastName:'test',company:'jeancoutu',jobTitle:'developpeur'},
    {firstName: 'test',lastName:'test',company:'jeancoutu',jobTitle:'developpeur'},
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
        //setRows(response.data.users);
        console.log(response.data);
        setRows(fakeRow);
    }

    useEffect(() => { fetchAllUsers(); }, [])

    return (
        <div>
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
                            <TableCell align="center"><strong>Signer</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((contract, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{contract.firstName + " " + contract.lastName} </TableCell>
                                <TableCell align="center">{contract.company}</TableCell>
                                <TableCell align="center">{contract.jobTitle}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained" color="secondary"
                                        size="small"
                                        // onClick={() => history.push(`/student-profile-page/${student.uniqueId}/${student.firstName + " " + student.lastName}`)}
                                    >
                                        signer le contrat
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