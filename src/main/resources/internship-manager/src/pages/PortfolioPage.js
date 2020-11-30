import React, { Component } from "react";

import Portfolio from '../components/Portfolio'

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

export default class PortfolioPage extends Component {

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

              <Portfolio></Portfolio>

          </Paper>

        </Container>

      </div>
    )
  }
}