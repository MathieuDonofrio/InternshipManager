import React, { Component } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import InternshipApplicationCreationForm from "../components/InternshipApplicationCreationForm";


export default class StudentInternshipApplicationPage extends Component {
  
  //
  // Constructor
  //

  constructor(props) {
    super();
  }

  //
  // Rendering
  //

  render() {
    return (
      <div>
        <CssBaseline />
        <Container>
          <Paper elevation={3}>
            <InternshipApplicationCreationForm />
          </Paper>
        </Container>
      </div>
    )
  }
}