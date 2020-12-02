import React, { Component } from "react";

import InternshipOfferCreationForm from '../components/InternshipOfferCreationForm'

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

export default class InternshipOfferCreationPage extends Component {

  //
  // Constructors
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

            <InternshipOfferCreationForm/>

          </Paper>

        </Container>

      </div>
    )
  }
}