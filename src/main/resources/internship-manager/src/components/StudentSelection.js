import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import InternshipOfferService from "../services/InternshipOfferService";
import StudentApplicationList from "./StudentApplicationList";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';



//tables values
const useStyles = makeStyles({
  table: {
    minWidth: 600,
  },
});

// Dialog


function StudentApplicationDialogProps(props) {

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <StudentApplicationList onClose={handleClose} selectedValue={selectedValue} />
    </Dialog>
  );

}

StudentApplicationDialogProps.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function StudentSelection() {

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = useState([]);
  const [currentInternshipId, setCurrentInternshipId] = useState('');

  const classes = useStyles();

  const uniqueId = localStorage.getItem('UserUniqueId');


  const handleClickOpen = (internshipId) => {
    setCurrentInternshipId(internshipId)
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const fetchInternshipOffers = async () => {
    const response = await InternshipOfferService.getInternshipOfferByEmployer(uniqueId);
    setRows(response.data.internshipOffers);
  }

  useEffect(() => {
    fetchInternshipOffers();
  }, [])


  return (
    <div>
      <Container>
        <Box
          mb={2}
          paddingTop={2}
          textAlign="left"
        >
          <Typography component="h1" variant="h4" align="center">List Internship Offer</Typography>
        </Box>
      </Container>

      <TableContainer>
        <Table className={classes.table} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>Company</strong></TableCell>
              <TableCell align="center"><strong>Job Title</strong></TableCell>
              <TableCell align="center"><strong>Start Date</strong></TableCell>
              <TableCell align="center"><strong>Duration</strong></TableCell>
              <TableCell align="center"><strong>Salary</strong></TableCell>
              <TableCell align="center"><strong>Hours</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((offer, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" align="center">{offer.company}</TableCell>
                <TableCell component="th" scope="row" align="center">{offer.jobTitle}</TableCell>
                <TableCell component="th" scope="row" align="center">{new Date(offer.startDate).toLocaleDateString()}</TableCell>
                <TableCell component="th" scope="row" align="center">{offer.duration}</TableCell>
                <TableCell component="th" scope="row" align="center">{offer.salary.toFixed(2) + '$'}</TableCell>
                <TableCell component="th" scope="row" align="center">{offer.hours}</TableCell>
                <TableCell omponent="th" scope="row" ><Button variant="contained" color="primary" onClick={() => handleClickOpen(offer.uniqueId)}>SELECT</Button></TableCell>
              </TableRow>
            ))}
            
            <StudentApplicationDialogProps open={open} onClose={handleClose} selectedValue={currentInternshipId} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}