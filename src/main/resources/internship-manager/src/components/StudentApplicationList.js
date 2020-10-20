import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { withRouter } from 'react-router';
import Lock from '../utils/Lock'

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import InternshipOfferService from "../services/InternshipOfferService";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InternshipApplicationService from "../services/InternshipApplicationService";
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import StudentDetailsList from "./StudentDetailsList";


const useStyles = makeStyles({
  table: {
    minWidth: 800,
  },
});

function StudentPortfolioDetailsDialogProps(props) {

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <StudentDetailsList onClose={handleClose} selectedValue={selectedValue} />
    </Dialog>
  );

}

StudentPortfolioDetailsDialogProps.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function StudentApplicationList (props) {

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = useState([]);
  const [currentStudentId, setCurrentStudentId] = useState('');

  const classes = useStyles();

  const handleClose = () => {
    props.onClose();
  };

  const handleClickOpen = (userId) => {
    setCurrentStudentId(userId)
    setOpen(true);
  };

  const fetchStudentApplications = async () => {
    const response = await  InternshipApplicationService.getInternshipApplicationByOffer(props.selectedValue);
    setRows(response.data.applications)
  }

  useEffect(() => {
    fetchStudentApplications();
  }, [])

  const onApprovedClicked = async (application) => {

    InternshipApplicationService.approveApplication(application);
    console.log(application);

  }

  const onRejectedClicked = async (application) => {

    InternshipApplicationService.rejectApplication(application).then(()=>fetchStudentApplications());
    
  }



  return (
    <div>
      <Container>
        <Box
          mb={2}
          paddingTop={2}
          textAlign="left"
        >
          <Typography component="h1" variant="h4" align="center">List Internship Application</Typography>
        </Box>
      </Container>

      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>First Name</strong></TableCell>
              <TableCell align="center"><strong>Last Name</strong></TableCell>
              <TableCell align="center"><strong>Company</strong></TableCell>
              <TableCell align="center"><strong>Job Title</strong></TableCell>
              <TableCell align="center"><strong>Date</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row,index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" align="center">{row.studentFirstName}</TableCell>
                <TableCell component="th" scope="row" align="center">{row.studentLastName}</TableCell>
                <TableCell component="th" scope="row" align="center">{row.company}</TableCell>
                <TableCell component="th" scope="row" align="center">{row.jobTitle}</TableCell>
                <TableCell component="th" scope="row" align="center">{new Date(row.date).toLocaleDateString()}</TableCell>
                <TableCell omponent="th" scope="row" >

                  <Box margin={1}>
                    <Button
                      variant="contained" color="secondary"
                      size="small"
                      onClick={() => handleClickOpen(row.studentUniqueId)}
                    >
                      Details
                    </Button>
                  </Box>

                  <Box margin={1}>

                    <Button
                      variant="contained" color="primary"
                      size="small" startIcon={<ThumbUpAltOutlinedIcon />}
                      onClick={() =>onApprovedClicked(row.uniqueId)}
                    >
                      Approve
                    </Button>
                  </Box>

                  <Box margin={1}>
                    <Button
                      variant="contained" color="secondary"
                      size="small"
                      startIcon={<ThumbDownAltOutlinedIcon />} onClick={() =>onRejectedClicked(row.uniqueId)}
                    >
                      Reject
                    </Button>
                  </Box>

                </TableCell>
              </TableRow>
            ))}
            <StudentPortfolioDetailsDialogProps open={open} onClose={handleClose} selectedValue={currentStudentId} />
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={handleClose} color="primary" fullWidth>close</Button>
    </div>
  );
}