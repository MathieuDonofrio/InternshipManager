import React, { Component } from "react";

import CssBaseline from '@material-ui/core/CssBaseline';
import { Redirect } from 'react-router-dom'

export default class HomePage extends Component {

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
          <Redirect to={'/user/' + localStorage.getItem("UserUniqueId")} />
      </div>
    )
  }
}