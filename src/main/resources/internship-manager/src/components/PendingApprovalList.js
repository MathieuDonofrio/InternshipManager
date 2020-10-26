import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import AuthenticationService from '../services/AuthenticationService';
import Validator from '../utils/Validator';
import Lock from '../utils/Lock'
import Copyright from './Copyright';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Container from '@material-ui/core/Container';
import LockOutlined from '@material-ui/icons/LockOutlined';
import InternshipOfferService from "../services/InternshipOfferService";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import * as ReactBootStrap from "react-bootstrap";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';

//
// Data
//

const state = {
  internshipOffers: []
}

class PendingApprovalList extends Component {

  //
  // Constructors
  //

  constructor(props) {
    super();
    this.state = state;
    this.onUpdateInternshipOffers();

    this.submitLock = new Lock();
  }

  //
  // Event Handlers
  //

  onUpdateInternshipOffers() {

    InternshipOfferService.pendingApproval().then(response => {
      this.setState(response.data);
    });

  }

  onApprovedClicked(internshipOffer) {
    InternshipOfferService.approve(internshipOffer).then(response => {
      this.onUpdateInternshipOffers();
    });
  }

  onRejectedClicked(internshipOffer) {
    InternshipOfferService.reject(internshipOffer).then(response => {
      this.onUpdateInternshipOffers();
    });
  }

  //
  // Rendering
  //

  renderTableData() {
    return this.state.internshipOffers.map((internshipOffer, index) => {
      const { company, jobTitle, startDate, endDate, location, duration, salary, hours } = internshipOffer
      return (
        <TableRow key={index}>
          <TableCell component="th" scope="row" align="center">{company}</TableCell>
          <TableCell component="th" scope="row" align="center">{jobTitle}</TableCell>
          <TableCell component="th" scope="row" align="center">{new Date(startDate).toLocaleDateString()}</TableCell>
          <TableCell component="th" scope="row" align="center">{new Date(endDate).toLocaleDateString()}</TableCell>
          <TableCell component="th" scope="row" align="center">{location}</TableCell>
         {/* <TableCell component="th" scope="row" align="center">{duration}</TableCell>
         */} <TableCell component="th" scope="row" align="center">{salary.toFixed(2) + '$'}</TableCell>
          <TableCell component="th" scope="row" align="center">{hours}</TableCell>
          <TableCell omponent="th" scope="row" >
            <Box margin={1}>

              <Button
                variant="contained" color="primary"
                size="small" startIcon={<ThumbUpAltOutlinedIcon />}
                onClick={() => this.onApprovedClicked(internshipOffer)}
              >
                Approve
              </Button>
            </Box>

            <Box margin={1}>
              <Button
                variant="contained" color="secondary"
                size="small"
                startIcon={<ThumbDownAltOutlinedIcon />} onClick={() => this.onRejectedClicked(internshipOffer)}
              >
                Reject
              </Button>
            </Box>

          </TableCell>
        </TableRow>

      )
    })
  }

  render() {
    return (
      <div>
        <Container>
          <Box
            mb={2}
            paddingTop={2}
            textAlign="left"
          >
            <Typography component="h1" variant="h4" align="center">Pending Approval</Typography>
          </Box>
        </Container>

        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Company</strong></TableCell>
                <TableCell align="center"><strong>Job Title</strong></TableCell>
                <TableCell align="center"><strong>Start Date</strong></TableCell>
                <TableCell align="center"><strong>End Date</strong></TableCell>
                <TableCell align="center"><strong>Location</strong></TableCell>
               {/* <TableCell align="center"><strong>Duration</strong></TableCell>
                */}<TableCell align="center"><strong>Salary</strong></TableCell>
                <TableCell align="center"><strong>Hours</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.renderTableData()}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }
}

export default withRouter(PendingApprovalList);