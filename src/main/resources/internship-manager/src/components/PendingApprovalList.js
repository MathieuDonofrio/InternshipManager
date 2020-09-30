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

//
// Data
//

const state = {
    internshipOffers : []
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

  onUpdateInternshipOffers(){

    InternshipOfferService.pendingApproval().then(response =>{
        this.setState(response.data);
        console.log(this.state);
    });

  }

    onApprovedClicked(internshipOffer){
      InternshipOfferService.approve(internshipOffer).then(response =>{
          this.onUpdateInternshipOffers();
      });
    }

    onRejectedClicked(internshipOffer){
        InternshipOfferService.reject(internshipOffer).then(response =>{
            this.onUpdateInternshipOffers();
        });
    }





  //
  // Rendering
  //


  renderTableData(){
      return this.state.internshipOffers.map((internshipOffer, index) => {
          const {company, jobTitle, startDate, duration, salary, hours} = internshipOffer
          return(
            <tr key={index}>
                  <td>{company}</td>
                  <td>{jobTitle}</td>
                  <td>{startDate}</td>
                  <td>{duration}</td>
                  <td>{salary}</td>
                  <td>{hours}</td>
                  <td>
                      <Button type="button" class="btn btn-success" onClick={() => this.onApprovedClicked(internshipOffer)}>
                          Approve
                      </Button>
                      <Button type="button" class="btn btn-danger" onClick={() => this.onRejectedClicked(internshipOffer)}>
                          Reject
                      </Button>
                  </td>
            </tr>

          )
      })
  }

  render() {
    return (
            <div>
                <h1 id='title' class="text-center">Pending Internship Offers</h1>
                <ReactBootStrap.Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Job Title</th>
                            <th>Start Date</th>
                            <th>Duration</th>
                            <th>Salary</th>
                            <th>Hours</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </ReactBootStrap.Table>
            </div>
       
    )
  }
}

export default withRouter(PendingApprovalList);