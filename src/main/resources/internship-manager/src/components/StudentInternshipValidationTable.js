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
import Paper from '@material-ui/core/Paper';
import {Box} from "@material-ui/core";
import ValidatedStudentTable from "./ValidatedStudentTable";
import InternshipOfferService from '../services/InternshipOfferService';


//tables values
const useStyles = makeStyles({
    table: {
        minWidth: 600,
    },
});

function createData(jobTitle, name, date, duration) {
    return { jobTitle, name, date, duration };
}

const rows = [
    createData('Developper', 'Desjardin', '01/10/20', 12),
    createData('It support', 'Hydro-Québec', '11/10/20', 16),
    createData('Developper', 'Desjardins', '05/11/20', 14),
    createData('Data analysis', 'Gouvernement', '13/12/20', 15),
];


//dialogs


function ValidateStudentTableDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">VALIDATED STUDENT</DialogTitle>
        <ValidatedStudentTable onClose={handleClose}/>
    </Dialog>
  );
}

ValidateStudentTableDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

//other class

export default function StudentInternshipValidationTable() {
    const [open, setOpen] = React.useState(false);
    const [rowss,setRows] = useState([]);
    const classes = useStyles();
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = (value) => {
      setOpen(false);
    };

    const fetchInternshipOffers = async () => {
      const response = await InternshipOfferService.getApprovedOffers();
      setRows({rowss:response.data});
    }

    useEffect(() => {
      console.log('hello');
      fetchInternshipOffers();
    },[rowss])

    return (
        <Container>
        <Box
            mt={12}
            mb={2}
            textAlign="center">

            <Typography component="h1" variant="h4">Student offer validation</Typography>
        </Box>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Job Title</TableCell>
                        <TableCell align="center">Company Name</TableCell>
                        <TableCell align="right">Start Date</TableCell>
                        <TableCell align="right">Duration</TableCell>
                        <TableCell align="right">Edit Students</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">{row.jobTitle}</TableCell>
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="right">{row.date}</TableCell>
                            <TableCell align="right">{row.duration}</TableCell>
                            <TableCell align="right"> <Button variant="contained" color="primary" onClick={handleClickOpen}>Edit student</Button></TableCell>
                            <ValidateStudentTableDialog internshipId={row.uniqueId}  open={open} onClose={handleClose} selectedValue='' />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
    );
}
      /*
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                  Open simple dialog
                </Button>
    */