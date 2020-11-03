import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import InternshipOfferService from '../services/InternshipOfferService';
import Validator from '../utils/Validator';
import Lock from '../utils/Lock'
import DateFnsUtils from '@date-io/date-fns';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
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
import FormControl from '@material-ui/core/FormControl';
import SettingsService from "../services/SettingsService";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';



const useStyles = makeStyles(theme => ({
    formControl:{
        minWidth: 150,
        margin: theme.spacing(1),
        marginBottom: 30,
    },
    selectEmpty:{
        marginTop: theme.spacing(1),
    },
}));

export default function SemesterSelectionForm () {


    const classes = useStyles();
    const [session, setSession] = useState("");
    const [annee, setAnnee] = useState("");
    const [state, setState] = useState({
      approbationAutomatique : true,
    });

    let sessiontoloop = [
        {session:"Automne"},
        {session:"Hiver"},
        {session:"Été"}
    ]
    

  //
  // Event Handlers
  //

  const handleChange = (event) => {
     
    setState({ ...state, [event.target.name]: !(event.target.checked) });
    console.log(state);
  }

  const sessionName = () => {

    switch (session){

      case "Automne" : return "Autumn";
      break;
      case "Hiver" : return "Winter";
      break;
      case "Été" : return "Summer";
      break;
      default: return "Winter";
    }
  }

  

  const onFormSubmit = async () => {


    let semester = sessionName() + "-" + annee;

    SettingsService.semester(semester)
      .then(() => this.props.history.push('/home'))
      .catch(error => console.log(error.message));

  }

  const onClicked = () => {
    onFormSubmit();
  }

  


  //
  // Rendering
  //
    return (
      <Container component="main" maxWidth="md">

        <div>

        <Box
            mb={2}
            paddingTop={2}
            textAlign="center">

            <Typography component="h1" variant="h5">Paramètres</Typography>

          </Box>

          <Divider />

            <Box
              mb={0}
              paddingTop={2}
              textAlign="left">

              <Typography component="h1" variant="h6">Selection de semestre</Typography>

            </Box>

            <Grid container spacing={3}>

                <Grid item xs={4} >
                    <FormControl className={classes.formControl} >

                        <TextField
                            type="number"
                            label="Année"
                            value={annee}
                            onChange={(event) => setAnnee(event.target.value)}
                        >
                        </TextField>
                            
                    </FormControl>
                </Grid>

                <Grid item xs={4} >
                    <FormControl className={classes.formControl} >
                        <InputLabel id="session-label">Session</InputLabel>
                            <Select labelId="session-label" id="session-label-select" value={session} onChange={(event) => setSession(event.target.value) } >

                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {sessiontoloop.map(session => {
                                    return <MenuItem value={session.session}>{session.session}</MenuItem>;
                                })}

                            </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4}>
                  <Box mt={2}>
                    <Button
                      type="submit"
                      
                      variant="contained"
                      color="primary"
                      onClick={() => onClicked()}
                    >
                      Sélectionner
                    </Button>
                  </Box>
                </Grid>
            </Grid>


            <Box
              mb={2}
              paddingTop={2}
              textAlign="left">
              

              <Typography component="h1" variant="h6">Approbation</Typography>

            </Box>                            

            <FormControlLabel
              control={
                <Switch
                  checked={!(state.approbationAutomatique)}
                  onChange={handleChange}
                  name="approbationAutomatique"
                  color="primary"
                />
              }
              label="Approbation automatique"
            />


            <Box paddingBottom={2} />
        </div>
      </Container>
    )
  }