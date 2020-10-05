import { Button, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import InternshipOfferService from '../services/InternshipOfferService';

//filtering services

const filterValidableStudent = async (studentList,internshipId) =>{
  return InternshipOfferService.getValidatedStudent(internshipId).then(response =>{
    
    studentList = studentList.filter((student) =>{
      return !isInValidatedStudents(student,response.data.users)
    })

    return studentList;
  });
}

const isInValidatedStudents = (studentToValidate,validatedStudents) =>{
  return validatedStudents.some(student => {
    return student.uniqueId === studentToValidate.uniqueId;
  })
}

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

//real class

export default function ValidableStudentTable(props) {
  const [rows, setRows] = useState([]);

  const classes = useStyles();

  const handleClose = () => {
    props.onClose();
  }

  const addUser = (userId) => {
    const request = {userUniqueId: userId,offerUniqueId: props.internshipId}
    InternshipOfferService.addUser(request).then(() => {
      fetchValidableStudents();
    });
  }

  const fetchValidableStudents = async () => {
    const response = await InternshipOfferService.getAllStudent();
    const filteredStudent = await filterValidableStudent(response.data.users,props.internshipId);

    setRows(filteredStudent);
  }

  useEffect(() => {
    fetchValidableStudents();
  },[])

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Students name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row,index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">{row.firstName + ' ' + row.lastName}</TableCell>
                <TableCell align="right"> <Button variant="contained" color="primary" onClick={() => addUser(row.uniqueId)}>Add student</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={handleClose} color="primary" fullWidth>close</Button>
    </div>
  );

}