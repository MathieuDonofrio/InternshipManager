import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { Button, Container, Dialog, DialogTitle } from '@material-ui/core';
import ValidableStudentTable from './ValidableStudentTable';
import InternshipOfferService from '../services/InternshipOfferService';

//dialogs

function ValidableStudentTableDialog(props) {

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">VALIDABLE STUDENT</DialogTitle>
      <ValidableStudentTable internshipId={selectedValue} onClose={handleClose} />
    </Dialog>
  );
}

ValidableStudentTableDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};


//styles and data

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});


export default function ValidatedStudentTable(props) {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = useState([]);

  const classes = useStyles();

  const handleClose = () => {
    props.onClose();
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const removeStudent = (student) => {
    const request = {offerUniqueId: props.selectedValue,userUniqueId: student.uniqueId};
    console.log(request);
    InternshipOfferService.removeUser(request);
  }

  const fetchValidatedStudents = async () => {
    const response = await InternshipOfferService.getValidatedStudent(props.selectedValue);
    setRows(response.data.users)
  }

  useEffect(() => {
    fetchValidatedStudents();
  }, [])

  

  return (
    <Container>
      <Button variant="contained" color="primary" fullWidth onClick={handleClickOpen}>add student</Button>
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
                <TableCell align="right"> <Button variant="contained" color="primary" onClick={() => removeStudent(row)}>remove student</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={handleClose} color="primary" fullWidth>close</Button>
      <ValidableStudentTableDialog selectedValue={props.internshipId} open={open} onClose={handleClose} selectedValue='' />
    </Container>
  );
}
