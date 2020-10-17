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
import { Box } from "@material-ui/core";
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ValidatedStudentTable from "./ValidatedStudentTable";
import InternshipOfferService from '../services/InternshipOfferService';
import { RowingSharp } from '@material-ui/icons';
import InternshipApplicationService from '../services/InternshipApplicationService';


//tables values
const useStyles = makeStyles({
  table: {
    minWidth: 600,
  },
});

const state = {
  applications: []
}


//other class

export default function StudentInternshipApplicationValidationTable() {

  const [rows, setRows] = useState([]);

  const classes = useStyles();

  const onApprovedClicked = (appId) => {
    const request = {
      applicationId: appId,
      status: 'APPROVED'
    }
    InternshipApplicationService.approve(request).then(response => fetchApplications());
  };

  const onRejectedClicked = (appId) => {
    const request = {
      applicationId: appId,
      status: 'REJECTED'
    }
    InternshipApplicationService.reject(request).then(response => fetchApplications());

  };

  const fetchApplications = async () => {
    const response = await InternshipApplicationService.getInternshipPendingApplications();
    setRows(response.data.applications);
  }

  useEffect(() => {
    fetchApplications();
  }, [])

  return (
    <div>
      <Container>
        <Box
          mb={2}
          paddingTop={2}
          textAlign="center">

          <Typography component="h1" variant="h4">Approbations</Typography>
        </Box>
      </Container>
      {rows.length == 0 &&
        <Container>
          <Box
            mb={2}
            paddingTop={2}
            paddingBottom={2}
            textAlign="center">

            <Typography >Pas d'application pour vous</Typography>
          </Box>
        </Container>
      }
      {rows.length > 0 &&

        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Student Name</strong></TableCell>
                <TableCell align="center"><strong>Company</strong></TableCell>
                <TableCell align="center"><strong>Job Title</strong></TableCell>
                <TableCell align="center"><strong>Date</strong></TableCell>
                <TableCell align="center"><strong>Decision</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((application, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{application.studentFirstName + " " + application.studentLastName}</TableCell>
                  <TableCell align="center">{application.company}</TableCell>
                  <TableCell align="center">{application.jobTitle}</TableCell>
                  <TableCell align="center">{new Date().toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Box margin={1}>
                      <Button
                        variant="contained" color="primary"
                        size="small" startIcon={<ThumbUpAltOutlinedIcon />}
                        onClick={() => onApprovedClicked(application.uniqueId)}
                      >
                        Approve
                        </Button>
                    </Box>

                    <Box margin={1}>
                      <Button
                        variant="contained" color="secondary"
                        size="small"
                        startIcon={<ThumbDownAltOutlinedIcon />} onClick={() => onRejectedClicked(application.uniqueId)}
                      >
                        Reject
                        </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </div>
  );
}