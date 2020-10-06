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
import PortfolioService from "../services/PortfolioService";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import * as ReactBootStrap from "react-bootstrap";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

//
// Data
//

const state = {
  portfolioDocuments: []
}

class Portfolio extends Component {

  //
  // Constructors
  //

  constructor(props) {
    super();

    this.state = state;

    this.onUpdatePortfolio();

    this.submitLock = new Lock();
  }

  //
  // Event Handlers
  //

  onUpdatePortfolio() {

    let uuid = localStorage.getItem("UserUniqueId");

    const request = {
      userUniqueId: localStorage.getItem("UserUniqueId"),
    }

    PortfolioService.portfolioDocuments(uuid).then(response => {
      this.setState(response.data);
    });

  }

  onDelete(document) {

  }

  //
  // Rendering
  //

  render() {
    return (
      <div>
        <Container>
          <Box
            mb={2}
            paddingTop={2}
            textAlign="left"
          >
            <Typography component="h1" variant="h4" align="center">Portfolio</Typography>
          </Box>
        </Container>

        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Type</strong></TableCell>
                <TableCell align="center"><strong>File Name</strong></TableCell>
                <TableCell align="center"><strong>Upload Date</strong></TableCell>
                <TableCell align="center"><strong>Delete</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.portfolioDocuments.map((document, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" align="center">{document.type}</TableCell>
                      <TableCell component="th" scope="row" align="center">{document.fileName}</TableCell>
                      <TableCell component="th" scope="row" align="center">{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell omponent="th" scope="row" >
                        <Box margin={1}>
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon
                              onClick={() => this.onDelete(document)}
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }
}

export default withRouter(Portfolio);