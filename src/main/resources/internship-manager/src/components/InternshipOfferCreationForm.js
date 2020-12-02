import React, { Component } from "react";
import { withRouter } from 'react-router';
import { withSnackbar } from 'notistack';

import InternshipOfferService from '../services/InternshipOfferService';
import Validator from '../utils/Validator';
import Lock from '../utils/Lock'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MuiPhoneNumber from "material-ui-phone-number";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

//
// Data
//

const state = {
  company: '',
  phone: '',
  jobTitle: '',
  jobScope: new Array(),
  schedule: '',
  startDate: new Date(),
  endDate: new Date(),
  location: '',
  address: '',
  city: '',
  postal: '',
  country: '',
  region: '',
  duration: 0,
  salary: 0,
  hours: 0,
  currentScope: '',
}

const errors = {
  company: '',
  phone: '',
  jobTitle: '',
  jobScope: '',
  startDate: '',
  endDate: '',
  schedule: '',
  location: '',
  address: '',
  phone: '',
  city: '',
  postal: '',
  country: '',
  region: '',
  duration: '',
  salary: '',
  hours: ''
}

class InternshipOfferCreationForm extends Component {

  //
  // Constructors
  //

  constructor(props) {
    super();

    this.state = state;
    this.errors = errors;

    this.submitLock = new Lock();

    Validator.clearErrors(this.errors);
    this.state.jobScope = new Array();
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
      phone: this.state.phone,
      jobTitle: this.state.jobTitle,
      jobScope: this.state.jobScope,
      startDate: this.state.startDate.getTime(),
      endDate: this.state.endDate.getTime(),
      schedule: this.state.schedule,
      location: this.state.address + "," + this.state.city + "," + this.state.postal + "," + this.state.country + "," + this.state.region,
      salary: this.state.salary,
      hours: this.state.hours
    }

    InternshipOfferService.create(request)
      .then(response => {
        this.props.history.push(`/internship-offer/${response.data}`)
        this.props.enqueueSnackbar("Offre de stage crée", { variant: 'success' });
      })
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

  onPhoneChange = value => this.setState({ phone: value });


  //
  // Validation
  //

  frontendValidation(event) {

    Validator.clearErrors(this.errors);

    this.errors.company = Validator.notBlank(this.state.company, "La compagnie est obligatoire");
    this.errors.jobTitle = Validator.notBlank(this.state.jobTitle, "Titre du poste est obligatoire");
    this.errors.phone = Validator.notBlank(this.state.phone, "Titre du poste est obligatoire");
    this.errors.address = Validator.notBlank(this.state.address, "L'adresse est obligatoire");
    this.errors.city = Validator.notBlank(this.state.city, "La ville est obligatoire");
    this.errors.postal = Validator.notBlank(this.state.postal, "Le code postal est obligatoire");
    this.errors.country = Validator.notBlank(this.state.country, "Le pays est obligatoire");
    this.errors.phone = Validator.validPhone(this.state.phone, "Entrez un numéro valide");
    this.errors.schedule = Validator.notBlank(this.state.schedule, "L'horaire est obligatoire");
    this.errors.salary = Validator.positive(this.state.salary, "Le salaire ne peut pas être négative");
    this.errors.hours = Validator.min(this.state.hours, 1, "L'heure doit être au moins à 1");
    this.errors.startDate = Validator.after(this.state.startDate, new Date(), "Impossible de définir une date de début dans le passé");
    this.errors.endDate = Validator.after(this.state.endDate, this.state.startDate.getTime(), "Impossible de définir une date de fin avant la date de début");
    if (this.errors.endDate == '')
      this.errors.endDate = Validator.week((this.state.endDate.getTime() - this.state.startDate.getTime()) / (1000 * 3600 * 24), "Impossible de définir une date de fin moins d'une semaine après le début");
    this.forceUpdate();
  }

  backendValidation(error) {

    Validator.clearErrors(this.errors);

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

            <Typography component="h1" variant="h4">Créer une offre de stage</Typography>

          </Box>

          <Divider />

          <form noValidate onSubmit={this.onFormSubmit}>

            <Box mt={2} textAlign="left">
              <Typography component="h2">Général</Typography>
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
              label="Compagnie"
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
              label="Titre du poste"
              name="jobTitle"
              autoComplete="jobTitle"
            />

            <MuiPhoneNumber
              error={this.errors.phone}
              helperText={this.errors.phone}
              defaultCountry={'ca'}
              id="phone"
              name="phone"
              value={this.state.phone}
              variant="outlined"
              required
              margin="normal"
              label="Téléphone"
              helperText="*Le telephone est seulement utilisé pour le contrat"
              onChange={this.onPhoneChange}
            />
            <TextField
              error={this.errors.address}
              label="Address"
              id="address"
              name="address"
              helperText="Exemple: 39 Saint-Catherine"
              fullWidth
              onChange={this.onChange}
              variant="outlined"
              margin="normal"
              required />
            <Grid container spacing={2}>

              <Grid item xs={12} sm={3}>
                <TextField
                  error={this.errors.city}
                  label="Ville"
                  id="city"
                  name="city"
                  helperText="Exemple: Toronto"
                  onChange={this.onChange}
                  variant="outlined"
                  margin="normal"

                  required />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  error={this.errors.postal}
                  label="Zip / Code postal"
                  id="postal"
                  name="postal"
                  helperText="Exemple: H5W 1F3"
                  onChange={this.onChange}
                  variant="outlined"
                  margin="normal"
                  required />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  error={this.errors.country}
                  onChange={this.onChange}
                  label="Pays"
                  id="country"
                  name="country"
                  helperText="Exemple: Usa"
                  variant="outlined"
                  margin="normal"
                  required />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  error={this.errors.region}
                  onChange={this.onChange}
                  label="Region/Province/Etat"
                  id="region"
                  name="region"
                  helperText="Si applicatif. Exemple: Alberta ou Florida"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Box mt={2} textAlign="left">
              <Typography component="h2">Rémunération</Typography>
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
                  label="Salaire (par heure)"
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
                  label="Heures par semaine)"
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
                  label="Ajouter les tâches du poste"
                  name="currentScope"
                  autoComplete="currentScope"
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <Box
                  mt={2.5}>
                  <IconButton
                    color="secondary"
                    aria-label="Ajouter les tâches du poste"
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
              <Typography component="h2">Temps</Typography>
            </Box>
            <TextField
              onChange={this.onChange}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="schedule"
              label="Horaire"
              name="schedule"
              helperText="Exemple: Lundi-Vendredi 8h30-5h"
              autoComplete="schedule"
            />


            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-evenly">
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="startDate"
                  label="Date de début"
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
                  label="Date de fin"
                  error={this.errors.endDate}
                  helperText={this.errors.endDate}
                  value={this.state.endDate}
                  onChange={this.onEndDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'end date',
                  }}
                />
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
                Créer
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

export default withSnackbar(withRouter(InternshipOfferCreationForm));