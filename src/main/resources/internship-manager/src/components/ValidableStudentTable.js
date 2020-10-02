import { Button, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import InternshipOfferService from '../services/InternshipOfferService';

const useStyles = makeStyles({
    table: {
        minWidth: 500,
    },
});

function createData(fistName, lastName) {
    return { fistName, lastName };
}

const rows = [
    createData('Mathieu', 'Donofrio'),
    createData('Hichem', 'Fredj'),
    createData('Steve', 'Henegar'),
];



export default function ValidableStudentTable(props){
    const classes = useStyles();
    
    const handleClose = () =>{
        props.onClose();
    }

    const addUser = (request) =>{
        InternshipOfferService.addUser(request).then(() =>{
            //refresh 
        });
    }

    InternshipOfferService.getValidatedStudent(props.internshipId).then(() =>{
        //find a way to refresh
    })

     return (
        <Container>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Students name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.fistName}>
                                <TableCell component="th" scope="row">{row.fistName + ' ' + row.lastName}</TableCell>
                                <TableCell align="right"> <Button variant="contained" color="primary" onClick={() => addUser(row)}>Add student</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant="contained" onClick={handleClose} color="primary" fullWidth>close</Button>
        </Container>
    );
 
}