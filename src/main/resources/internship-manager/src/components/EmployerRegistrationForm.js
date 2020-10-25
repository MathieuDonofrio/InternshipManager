import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import RegistrationService from '../services/RegistrationService';
import Validator from '../utils/Validator';
import Lock from '../utils/Lock'
import Copyright from './Copyright';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
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
  firstName: '',
  lastName: '',
  password: '',
  company: '',
  confirm: ''
}

const errors = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  company: '',
  confirm: ''
}

class EmployerRegistrationForm extends Component {

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
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      company: this.state.company
    }

    RegistrationService.employer(request)
      .then(() => this.props.history.push('/login'))
      .catch(error => this.backendValidation(error))
      .finally(() => { this.submitLock.unlock(); this.forceUpdate() });
  }

  onChange = event => this.setState({ [event.target.name]: event.target.value });

  //
  // Validation
  //

  frontendValidation(event) {

    Validator.clearErrors(this.errors);

    this.errors.email = Validator.email(this.state.email, "Email is not valid");
    this.errors.firstName = Validator.notBlank(this.state.firstName, "First name is mandatory");
    this.errors.lastName = Validator.notBlank(this.state.lastName, "Last name is mandatory");
    this.errors.password = Validator.size(this.state.password, 6, 18, "Password size must be between 6 and 18");
    this.errors.company = Validator.notBlank(this.state.company, "Company is mandatory")
    this.errors.confirm = Validator.match(this.state.password, this.state.confirm, "Password does not match");

    this.forceUpdate();
  }

  backendValidation(error) {

    Validator.clearErrors(this.errors);

    this.errors.email = Validator.mapBackendError(error, "email");

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
            <Typography component="h1" variant="h4">Register As Employer</Typography>

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

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={this.errors.firstName}
                  helperText={this.errors.firstName}
                  onChange={this.onChange}
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={this.errors.lastName}
                  helperText={this.errors.lastName}
                  onChange={this.onChange}
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  margin="normal"

                />
              </Grid>
            </Grid>

            <TextField
              error={this.errors.company}
              helperText={this.errors.company}
              onChange={this.onChange}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="company"
              label="Company"
              name="company"
              autoComplete="company"
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

            <TextField
              error={this.errors.confirm}
              helperText={this.errors.confirm}
              onChange={this.onChange}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirm"
              label="Confirm"
              type="password"
              id="confirm"
            />

            <Box mt={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={this.submitLock.locked}
              >
                Register
                </Button>
            </Box>

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
                </Grid>
                <Grid item>

                  <Link to="/login">
                    Already have an account? Log in
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

export default withRouter(EmployerRegistrationForm);