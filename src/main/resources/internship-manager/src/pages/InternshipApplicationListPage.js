import React, { Component } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import InternshipApplicationList from "../components/InternshipApplicationList";

export default class InternshipApplicationListPage extends Component {

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

              <InternshipApplicationList/>

          </Paper>

        </Container>

      </div>
    )
  }
}