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
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { DropzoneArea} from 'material-ui-dropzone'

//
// Data
//

const state = {
  portfolioDocuments: [],
  open: false,
  files: [],
  type: "Resume",
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

    PortfolioService.portfolioDocuments(uuid).then(response => {
      this.setState(response.data);
    });

  }

  onDelete = (document) => {

    const request = {
      uniqueId: document.uniqueId
    }

    PortfolioService.delete(request).then(() => {
      this.onUpdatePortfolio();
    })

  }

  onSend = () => {

    const request = {
      type: this.state.type,
      file: this.state.files[0]
    }

    PortfolioService.upload(request).then(() => {
      this.onUpdatePortfolio();
    })

    this.onDialogClose();

  }

  onFileUpload = (files) => this.setState({files: files});

  onDialogOpen = () => this.setState({ open: true });

  onDialogClose = () => this.setState({ open: false });

  onChange = event => this.setState({ [event.target.name]: event.target.value });

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

        <Box margin={1}>
          <Button
            variant="contained" color="primary"
            size="small" startIcon={<AddIcon />}
            onClick={this.onDialogOpen}
          >
            Add Document
          </Button>
        </Box>

        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Type</strong></TableCell>
                <TableCell align="center"><strong>File</strong></TableCell>
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

          <Dialog open={this.state.open} onClose={this.onDialogClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Document</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add a document please select the type and upload the document.
          </DialogContentText>
            <FormControl>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={this.state.type}
                onChange={this.onChange}
              >
                <MenuItem value={"Resume"}>Resume</MenuItem>
                <MenuItem value={"Cover Letter"}>Cover Letter</MenuItem>
                <MenuItem value={"Grades"}>Grades</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>
            <Box marginTop={2}>
              <DropzoneArea
                name="files"
                dropzoneText={"Drag and drop or click to upload " + this.state.type.toLowerCase()}
                filesLimit={1}
                onChange={this.onFileUpload}
                >

              </DropzoneArea>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onDialogClose} color="primary">
              Cancel
          </Button>
            <Button onClick={this.onSend} color="primary">
              Add
          </Button>
          </DialogActions>
        </Dialog>

      </div>
    )
  }
}

export default withRouter(Portfolio);