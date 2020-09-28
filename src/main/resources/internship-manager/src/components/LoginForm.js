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

//
// Data
//

const state = {
  email: '',
  password: '',
}

const errors = {
  email: '',
  password: '',
}

class LoginForm extends Component {

  //
  // Constructors
  //

  constructor(props) {
    super();

    this.state = state;
    this.errors = errors;

    this.submitLock = new Lock();
  }

  //
  // Event Handlers
  //

  onFormSubmit = event => {

    event.preventDefault();

    this.frontendValidation(event);

    if (Validator.hasErrors(this.errors) || true === this.submitLock.lock()) return;

    const request = {
      email: this.state.email,
      password: this.state.password
    }

    AuthenticationService.authenticate(request)
      .then(() => this.props.history.push('/home'))
      .catch(error => this.backendValidation(error))
      .finally(() => { 
        this.submitLock.unlock(); 
        this.forceUpdate();
      });
  }

  onChange = event => this.setState({ [event.target.name]: event.target.value });

  //
  // Validation
  //

  frontendValidation(event) {

    Validator.clearErrors(this.errors);

    this.errors.email = Validator.email(this.state.email, "Email is not valid");
    this.errors.password = Validator.notBlank(this.state.password, "Password is mandatory");

    this.forceUpdate();
  }

  backendValidation(error) {

    Validator.clearErrors(this.errors);

    this.errors.email = "Email or password is incorrect";
    this.errors.password = "Email or password is incorrect";

    this.forceUpdate();
  }

  //
  // Rendering
  //

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <div>

          <Box
            mt={12}
            mb={2}
            textAlign="center">

            <LockOutlined fontSize="large" />
            <Typography component="h1" variant="h4">Log in</Typography>

          </Box>

          <form noValidate onSubmit={this.onFormSubmit}>

            <TextField
              error={this.errors.email}
              helperText={this.errors.email}
              onChange={this.onChange}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />

            <TextField
              error={this.errors.password}
              helperText={this.errors.password}
              onChange={this.onChange}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={this.submitLock.locked}
            >
              Log In
                </Button>

            {
              this.submitLock.locked &&
              <Box mt={2}>
                <LinearProgress
                  variant="query" />
              </Box>
            }

            <Box mt={2}>
              <Grid container mt={4}>
                <Grid item xs>
                  <Link>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/registration">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>

          </form>
        </div>
        <Box mt={4}>
          <Copyright />
        </Box>
      </Container>
    )
  }
}

export default withRouter(LoginForm);