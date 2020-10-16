import React, { Component } from "react";
import InternshipApplicationService from "../services/InternshipApplicationService";
import { withRouter } from 'react-router';
import Lock from '../utils/Lock'

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


//
// Data
//

const state = {
    applications : []
}

 
class StudentApplicationStatusList extends Component{

    //
    // Constructors
    //

    constructor(props){
        super();
        this.state = state;
        this.onUpdateStudentApplicationsList();
        this.submitLock = new Lock();
    }

    //
    // Event Handlers
    //

    onUpdateStudentApplicationsList(){
        let userId =localStorage.getItem("UserUniqueId");
        InternshipApplicationService.internshipApplications(userId).then(response =>{
          console.log(response.data);
            this.setState(response.data);
        })
    }

    //
    // Rendering
    //

    renderTableData() {
        return this.state.applications.map((studentAppList, index) => {
          const {studentFirstName, studentLastName, company, jobTitle, date, status} = studentAppList
          let newStatus = "";
          if (status == "PENDING_APPROVAL"){
            console.log("YESYESYES");
            newStatus = "PENDING APPROVAL"
          }else{
            newStatus = status;
          }
          return (
            <TableRow key={index}>
              <TableCell component="th" scope="row" align="center">{studentFirstName}</TableCell>
              <TableCell component="th" scope="row" align="center">{studentLastName}</TableCell>
              <TableCell component="th" scope="row" align="center">{company}</TableCell>
              <TableCell component="th" scope="row" align="center">{jobTitle}</TableCell>
              <TableCell component="th" scope="row" align="center">{new Date(date).toLocaleDateString()}</TableCell>
              <TableCell component="th" scope="row" align="center">{newStatus}</TableCell>
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
              <Typography component="h1" variant="h4" align="center">Applications Status</Typography>
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
                  <TableCell align="center"><strong>Status</strong></TableCell>
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
export default withRouter(StudentApplicationStatusList);