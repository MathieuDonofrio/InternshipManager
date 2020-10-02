import { Button, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import InternshipOfferService from '../services/InternshipOfferService';

function createData(fistName, lastName) {
  return { fistName, lastName };
}

const rows = [
  createData('Mathieu', 'Donofrio'),
  createData('Hichem', 'Fredj'),
  createData('Steve', 'Henegar'),
];



export default function ValidableStudentTable(props) {

  const handleClose = () => {
    props.onClose();
  }

  const addUser = (request) => {
    InternshipOfferService.addUser(request).then(() => {
      //refresh 
    });
  }

  InternshipOfferService.getValidatedStudent(props.internshipId).then(() => {
    //find a way to refresh
  })

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
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
    </div>
  );

}