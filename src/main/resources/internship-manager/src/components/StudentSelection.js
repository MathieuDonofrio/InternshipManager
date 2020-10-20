import React, { Component } from "react";
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
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';

//
// Data
//

const state = {
  internshipOffers: []
}


class StudentSelection extends Component {

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

    const uniqueId = localStorage.getItem('UserUniqueId');


    InternshipOfferService.getInternshipOfferByEmployer(uniqueId).then(response =>{
        this.setState(response.data);
    });

  }


  //
  // Rendering
  //

  renderTableData() {
    return this.state.internshipOffers.map((internshipOffer, index) => {
      const { company, jobTitle, startDate, duration, salary, hours } = internshipOffer
      return (
        <TableRow key={index}>
          <TableCell component="th" scope="row" align="center">{company}</TableCell>
          <TableCell component="th" scope="row" align="center">{jobTitle}</TableCell>
          <TableCell component="th" scope="row" align="center">{new Date(startDate).toLocaleDateString()}</TableCell>
          <TableCell component="th" scope="row" align="center">{duration}</TableCell>
          <TableCell component="th" scope="row" align="center">{salary}</TableCell>
          <TableCell component="th" scope="row" align="center">{hours}</TableCell>
          <TableCell omponent="th" scope="row" >
            <Box margin={1}>
                <Button
                    variant="contained" color="primary"
                    size="small"
                    // onClick={() => this.onApprovedClicked(internshipOffer)}
                >
                    Select
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
            <Typography component="h1" variant="h4" align="center">List Internship Offer</Typography>
          </Box>
        </Container>

        <TableContainer>
          <Table size="small" aria-label="a dense table">
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
              {this.renderTableData()}
            </TableBody>
          </Table>
        </TableContainer>
      </div>


    )
  }
}

export default withRouter(StudentSelection);