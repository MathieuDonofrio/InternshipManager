import React, { Component } from "react";


import InternshipOfferService from '../services/InternshipOfferService';
import Validator from '../utils/Validator';
import Lock from '../utils/Lock'
import DateFnsUtils from '@date-io/date-fns';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

//
// Data
//

const state = {
  company: '',
  jobTitle: '',
  jobScope: new Array(),
  startDate: new Date(),
  endDate: new Date(),
  duration: 0,
  salary: 0,
  hours: 0,
  currentScope: '',
}

const errors = {
  company: '',
  jobTitle: '',
  jobScope: '',
  startDate: '',
  endDate: '',
  duration: '',
  salary: '',
  hours: ''
}

export default class InternshipOfferCreationForm extends Component {

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
      company: this.state.company,
      jobTitle: this.state.jobTitle,
      jobScope: this.state.jobScope,
      startDate: this.state.startDate.getTime(),
      duration: this.state.duration,
      salary: this.state.salary,
      hours: this.state.hours
    }

    InternshipOfferService.create(request)
      .catch(error => this.backendValidation(error))
      .finally(() => { this.submitLock.unlock(); this.forceUpdate() });
  }

  onJobScopeAdd = () => {
    if (this.state.currentScope.length > 0) {
      this.state.jobScope.push(this.state.currentScope);
      this.state.currentScope = '';
      this.forceUpdate();
    }
  }

  onJobScopeDelete = (value) => {
    this.state.jobScope.splice(this.state.jobScope.indexOf(value), 1);
    this.forceUpdate();
  }

  onDateChange = date => this.setState({ startDate: date });
  onEndDateChange = date => this.setState({ endDate: date });

  onChange = event => this.setState({ [event.target.name]: event.target.value });

  //
  // Validation
  //

  frontendValidation(event) {

    Validator.clearErrors(this.errors);

    this.errors.company = Validator.notBlank(this.state.company, "Company is mandatory");
    this.errors.jobTitle = Validator.notBlank(this.state.jobTitle, "Job title is mandatory");
    this.errors.salary = Validator.positive(this.state.salary, "Salary cannot be negative");
    this.errors.hours = Validator.min(this.state.hours, 1, "Hours must be atleast 1");
   // this.errors.duration = Validator.min(this.state.duration, 1, "Duration must be atleast 1 week");
    this.errors.startDate = Validator.after(this.state.startDate, new Date(), "Cannot set a start date in the past");
    this.errors.endDate = Validator.after(this.state.endDate,this.state.startDate.getTime(), "Cannot set a end date before start date");
    if(this.errors.endDate == '')
      this.errors.endDate = Validator.week((this.state.endDate.getTime()-this.state.startDate.getTime())/ (1000 * 3600 * 24), "Cannot set a end date less than a week after start");
    this.forceUpdate();
  }

  backendValidation(error) {

    Validator.clearErrors(this.errors);

    console.log(error);

    this.forceUpdate();
  }

  //
  // Rendering
  //

  render() {
    return (
      <Container component="main" maxWidth="md">

        <div>

          <Box
            mb={2}
            paddingTop={2}
            textAlign="left">

            <Typography component="h1" variant="h4">Create Internship Offer</Typography>

          </Box>

          <Divider />

          <form noValidate onSubmit={this.onFormSubmit}>

            <Box mt={2} textAlign="left">
              <Typography component="h2">General</Typography>
            </Box>

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
              autoFocus
            />

            <TextField
              error={this.errors.jobTitle}
              helperText={this.errors.jobTitle}
              onChange={this.onChange}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="jobTitle"
              label="Job Title"
              name="jobTitle"
              autoComplete="jobTitle"
            />

            <Box mt={2} textAlign="left">
              <Typography component="h2">Remuneration</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={this.errors.salary}
                  helperText={this.errors.salary}
                  onChange={this.onChange}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  type="number"
                  id="salary"
                  label="Salary (Per Hour)"
                  name="salary"
                  autoComplete="salary"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={this.errors.hours}
                  helperText={this.errors.hours}
                  onChange={this.onChange}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  type="number"
                  id="hours"
                  label="Hours (Per Week)"
                  name="hours"
                  autoComplete="hours"

                />
              </Grid>
            </Grid>

            <Box mt={2} textAlign="left">
              <Typography component="h2">Description</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={20} sm={10}>
                <TextField
                  value={this.state.currentScope}
                  onChange={this.onChange}
                  variant="filled"
                  margin="normal"
                  required
                  fullWidth
                  type="text"
                  id="currentScope"
                  label="Add Job Scope"
                  name="currentScope"
                  autoComplete="currentScope"
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <Box
                  mt={2.5}>
                  <IconButton
                    color="secondary"
                    aria-label="Add job scope"
                    component="span"
                    onClick={this.onJobScopeAdd}>
                    <AddCircleOutlineOutlinedIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            <List dense={true}>
              {
                this.state.jobScope.map((value) => {
                  return (
                    <ListItem>
                      <ListItemText
                        primary={value}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon
                            onClick={() => this.onJobScopeDelete(value)} 
                            />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                })
              }
            </List>

            <Box mt={2} textAlign="left">
              <Typography component="h2">Time</Typography>
            </Box>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-evenly">
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="startDate"
                  label="Start Date"
                  error={this.errors.startDate}
                  helperText={this.errors.startDate}
                  value={this.state.startDate}
                  onChange={this.onDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="endDate"
                  label="End Date"
                  error={this.errors.endDate}
                  helperText={this.errors.endDate}
                  value={this.state.endDate}
                  onChange={this.onEndDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'end date',
                  }}
                />
                {/*
                <TextField
                  error={this.errors.duration}
                  helperText={this.errors.duration}
                  onChange={this.onChange}
                  id="duration"
                  label="Duration (Weeks)"
                  type="number"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                  name="duration"
                />
                */}
              </Grid>
            </MuiPickersUtilsProvider>

            <Box mt={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={this.submitLock.locked}
              >
                Create
              </Button>
            </Box>

            {
              this.submitLock.locked &&
              <Box mt={2}>
                <LinearProgress
                  variant="query" />
              </Box>
            }

            <Box paddingBottom={2} />

          </form>
        </div>
      </Container>
    )
  }
}