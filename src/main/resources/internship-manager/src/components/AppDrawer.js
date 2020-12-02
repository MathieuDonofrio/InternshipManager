import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import AuthenticationService from '../services/AuthenticationService';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import PeopleIcon from '@material-ui/icons/People';
import HomeIcon from '@material-ui/icons/Home';
import CreateIcon from '@material-ui/icons/Create';
import AssignmentIndSharpIcon from '@material-ui/icons/AssignmentIndSharp';
import SettingsService from "../services/SettingsService";
import SettingsIcon from '@material-ui/icons/Settings';
import FolderOpenSharpIcon from '@material-ui/icons/FolderOpenSharp';
import AssignmentSharpIcon from '@material-ui/icons/AssignmentSharp';
import AssignmentLateSharpIcon from '@material-ui/icons/AssignmentLateSharp';
import SupervisorAccountSharpIcon from '@material-ui/icons/SupervisorAccountSharp';
import PostAddSharpIcon from '@material-ui/icons/PostAddSharp';


const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    flexGrow: 1,
  },
  panelTitle: {
    flexGrow: 1,
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    color: 'white',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function AppDrawer(props) {

  const [open, setOpen] = useState(false);
  const [session, setSession] = useState();

  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  useEffect(() => { getSession(); }, [])

  const userType = () => {

    let type = localStorage.getItem('UserType').toLowerCase();

    switch (type) {
      case "student": return "ÉTUDIANT";
      case "employer": return "EMPLOYEUR";
      case "administrator": return "ADMINISTRATEUR";
      default: return "ÉTUDIANT";
    }
  }

  const getSession = () => {

    SettingsService.getSemester().then((response) => {
      let split = response.data.split('-');

      setSession(translateSession(split[0]) + "-" + split[1]);
    });
  }

  const translateSession = (session) => {
    switch (session) {
      case "AUTUMN": return "Automne";
      case "WINTER": return "Hiver";
      case "SUMMER": return "Été";
      default: return "ERROR";
    }
  }

  const isStudent = () => {
    return localStorage.getItem('UserType') === "STUDENT";
  }

  const isEmployer = () => {
    return localStorage.getItem('UserType') === "EMPLOYER";
  }

  const isAdministrator = () => {
    return localStorage.getItem('UserType') === "ADMINISTRATOR";
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.panelTitle}>
            {"PANNEAU " + userType()}
          </Typography>

          <Typography variant="h6" noWrap className={classes.panelTitle}>
            {"Session Actuelle : " + session}
          </Typography>

          <Button
            color="inherit"
            onClick={() => {
              AuthenticationService.logout();
              history.push("/login");
            }}>Se déconnecter</Button>

        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>

        <List>

          <Divider />

          <ListItem
            button
            key={"Home"}
            onClick={() => history.push("/home")}>
            <ListItemIcon><HomeIcon /> </ListItemIcon>
            <ListItemText primary={"Accueil"} />
          </ListItem>

          <Divider />


          <ListItem
            button
            key={"Signature"}
            onClick={() => history.push("/create-signature")}>
            <ListItemIcon><CreateIcon /> </ListItemIcon>
            <ListItemText primary={"Signature"} />
          </ListItem>


          {
            isStudent() &&
            <ListItem
              button
              key={"Portfolio"}
              onClick={() => history.push("/portfolio")}>
              <ListItemIcon><FolderOpenSharpIcon /> </ListItemIcon>
              <ListItemText primary={"Portfolio"} />
            </ListItem>
          }

          {
            isEmployer() &&
            <ListItem
              button
              key={"Offer Creation"}
              onClick={() => history.push("/internship-offer-creation")}>
              <ListItemIcon><PostAddSharpIcon /> </ListItemIcon>
              <ListItemText primary={"Création d'offre"} />
            </ListItem>
          }

          {
            isAdministrator() &&
            <ListItem
              button
              key={"Paramètres"}
              onClick={() => history.push("/settings")}>
              <ListItemIcon><SettingsIcon /> </ListItemIcon>
              <ListItemText primary={"Paramètres"} />
            </ListItem>
          }

          <Divider />

          {
            isStudent() &&
            <div>
              <ListItem
                button
                key={"All offers"}
                onClick={() => history.push("/internship-offers")}>
                <ListItemIcon><AssignmentSharpIcon /> </ListItemIcon>
                <ListItemText primary={"Offres"} />
              </ListItem>
              <ListItem
                button
                key={"Applications"}
                onClick={() => history.push("/internship-applications")}>
                <ListItemIcon><AssignmentIndSharpIcon /> </ListItemIcon>
                <ListItemText primary={"Applications"} />
              </ListItem>
              <ListItem
                button
                key={"Contracts"}
                onClick={() => history.push("/contracts")}>
                <ListItemIcon><AssignmentLateSharpIcon /> </ListItemIcon>
                <ListItemText primary={"Contrats"} />
              </ListItem>
            </div>
          }

          {
            isEmployer() &&
            <div>
              <ListItem
                button
                key={"All offers"}
                onClick={() => history.push("/internship-offers")}>
                <ListItemIcon><AssignmentSharpIcon /> </ListItemIcon>
                <ListItemText primary={"Offres"} />
              </ListItem>
              <ListItem
                button
                key={"Applications"}
                onClick={() => history.push("/internship-applications")}>
                <ListItemIcon><AssignmentIndSharpIcon /> </ListItemIcon>
                <ListItemText primary={"Applications"} />
              </ListItem>
              <ListItem
                button
                key={"Contracts"}
                onClick={() => history.push("/contracts")}>
                <ListItemIcon><AssignmentLateSharpIcon /> </ListItemIcon>
                <ListItemText primary={"Contrats"} />
              </ListItem>
            </div>
          }

          {
            isAdministrator() &&
            <div>
              <ListItem
                button
                key={"All offers"}
                onClick={() => history.push("/internship-offers")}>
                <ListItemIcon><AssignmentSharpIcon /> </ListItemIcon>
                <ListItemText primary={"Offres"} />
              </ListItem>
              <ListItem
                button
                key={"Applications"}
                onClick={() => history.push("/internship-applications")}>
                <ListItemIcon><AssignmentIndSharpIcon /> </ListItemIcon>
                <ListItemText primary={"Applications"} />
              </ListItem>
              <ListItem
                button
                key={"Contracts"}
                onClick={() => history.push("/contracts")}>
                <ListItemIcon><AssignmentLateSharpIcon /> </ListItemIcon>
                <ListItemText primary={"Contrats"} />
              </ListItem>

              <ListItem
                button
                key={"Liste des étudiants"}
                onClick={() => history.push("/students")}>
                <ListItemIcon><PeopleIcon /> </ListItemIcon>
                <ListItemText primary={"Étudiants"} />
              </ListItem>

              <ListItem
                button
                key={"Liste des employés"}
                onClick={() => history.push("/employers")}>
                <ListItemIcon><SupervisorAccountSharpIcon /> </ListItemIcon>
                <ListItemText primary={"Employés"} />
              </ListItem>

            </div>
          }

        </List>

      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>

    </div>
  );
}
