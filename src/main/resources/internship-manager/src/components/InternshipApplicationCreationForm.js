import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, ListItem } from "@material-ui/core";
import ValidatedStudentTable from "./ValidatedStudentTable";
import InternshipOfferService from '../services/InternshipOfferService';
import InternshipApplicationService from '../services/InternshipApplicationService';
import { RowingSharp, Send } from '@material-ui/icons';

//tables values
const useStyles = makeStyles({
  table: {
    minWidth: 600,
  }
});

//dialogs


function ValidateStudentTableDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };
//<ValidatedStudentTable onClose={handleClose} selectedValue={selectedValue} />
  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Application enovye</DialogTitle>
    </Dialog>
  );
}

ValidateStudentTableDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

//other class

export default function InternshipApplicationCreationForm() {

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = useState([]);
  const [currentInternshipId, setCurrentInternshipId] = useState('');

  const classes = useStyles();

  const handleClickOpen = (internshipId,index) => {
    setCurrentInternshipId(internshipId)
    const request = {
      offerUniqueId: currentInternshipId,
      documents: new Array()
    }
    console.log(request.offerUniqueId);
    InternshipApplicationService.createInternshipApplication(request);
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const fetchInternshipOffers = async () => {
    const response = await InternshipOfferService.getApprovedOffers();
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
          textAlign="center">

          <Typography component="h1" variant="h4">Offer Visibility</Typography>
        </Box>
      </Container>

      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>Company</strong></TableCell>
              <TableCell align="center"><strong>Job Title</strong></TableCell>
              <TableCell align="center"><strong>Start Date</strong></TableCell>
              <TableCell align="center"><strong>Duration</strong></TableCell>
              <TableCell align="center"><strong>Hours</strong></TableCell>
              <TableCell align="center"><strong>Edit Students</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((offer,index) => (
              <TableRow key={index}>
                <TableCell align="center">{offer.company}</TableCell>
                <TableCell align="center">{offer.jobTitle}</TableCell>
                <TableCell align="center">{new Date(offer.startDate).toLocaleDateString()}</TableCell>
                <TableCell align="center">{offer.duration}</TableCell>
                <TableCell align="center">{offer.hours}</TableCell>
                <TableCell align="center"> <Button variant="contained" color="primary" onClick={() => handleClickOpen(offer.uniqueId,index)}>Appliquer</Button></TableCell>
              </TableRow>
            ))}
            <ValidateStudentTableDialog open={open} onClose={handleClose} selectedValue={currentInternshipId} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
