import React, { Component } from "react";
import { withRouter } from 'react-router';
import { withSnackbar } from 'notistack';

import { DropzoneArea } from 'material-ui-dropzone';

import Lock from '../utils/Lock'

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import PortfolioService from "../services/PortfolioService";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

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
    super(props);

    this.state = state;

    this.onUpdatePortfolio();

    this.submitLock = new Lock();
  }

  //
  // Event Handlers
  //

  onUpdatePortfolio() {

    let uuid = this.props.studentId ? this.props.studentId : localStorage.getItem("UserUniqueId");

    PortfolioService.portfolioDocuments(uuid).then(response => {
      this.setState(response.data);
    });

  }

  onView(document) {

    this.props.history.push(`/portfolio-document/${document.uniqueId}`);

  }

  onDelete = (document) => {

    const request = {
      uniqueId: document.uniqueId
    }

    PortfolioService.delete(request).then(() => {
      this.onUpdatePortfolio();
      this.props.enqueueSnackbar(document.fileName + " supprimé", { variant: 'success' });
    })

  }

  onSend = () => {

    const request = {
      type: this.state.type,
      file: this.state.files[0]
    }

    PortfolioService.upload(request).then(() => {
      this.onUpdatePortfolio();
      this.props.enqueueSnackbar(request.file.name + " téléversé", { variant: 'success' });
    })

    this.onDialogClose();

  }

  translateType = (type) => {
    switch (type) {
      case "Resume": return "Curriculum Vitae";
      case "Cover Letter": return "Lettre de motivation";
      case "Grades": return "Bulletin";
      case "Other": return "Autre";
    }
  }

  onFileUpload = (files) => this.setState({ files: files });

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

        <Divider/>

        {!this.props.studentId && <Box margin={1}>
          <Button
            variant="contained" color="primary"
            size="small" startIcon={<AddIcon />}
            onClick={this.onDialogOpen}
          >
            Ajouter un document
          </Button>
        </Box>}

        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Type</strong></TableCell>
                <TableCell align="center"><strong>Fichier</strong></TableCell>
                <TableCell align="center"><strong>Date de téléversement</strong></TableCell>
                <TableCell align="center"><strong>Supprimer</strong></TableCell>
                <TableCell align="center"><strong>Visionner</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.portfolioDocuments.map((document, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" align="center">{this.translateType(document.type)}</TableCell>
                      <TableCell component="th" scope="row" align="center">{document.fileName}</TableCell>
                      <TableCell component="th" scope="row" align="center">{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell component="th" scope="row" align="center" >
                        <Box margin={1}>
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon
                              onClick={() => this.onDelete(document)}
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell component="th" scope="row" align="center" >

                        <Box margin={1}>
                          <Button
                            variant="contained" color="secondary"
                            size="small"
                            onClick={() => this.onView(document)}
                          >
                            Voir
                          </Button>
                        </Box>

                      </TableCell>
                      <TableCell component="th" scope="row" align="center">
                        {
                          document.approved && <CheckIcon />
                        }

                        {
                          !document.approved && <ClearIcon />
                        }
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={this.state.open} onClose={this.onDialogClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Ajouter un document</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Pour ajouter un document, sélectionnez le type et téléversez le document.
          </DialogContentText>
            <FormControl>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={this.state.type}
                onChange={this.onChange}
              >
                <MenuItem value={"Resume"}>Curriculum Vitae</MenuItem>
                <MenuItem value={"Cover Letter"}>Lettre de motivation</MenuItem>
                <MenuItem value={"Grades"}>Bulletin</MenuItem>
                <MenuItem value={"Other"}>Autre</MenuItem>
              </Select>
            </FormControl>
            <Box marginTop={2}>
              <DropzoneArea
                name="files"
                dropzoneText={"Glissez-déposez ou cliquez pour téléversez le document"}
                filesLimit={1}
                onChange={this.onFileUpload}
              >

              </DropzoneArea>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onDialogClose} color="primary">
              Annuler
          </Button>
            <Button onClick={this.onSend} color="primary">
              Ajouter
          </Button>
          </DialogActions>
        </Dialog>

      </div>
    )
  }
}

export default withSnackbar(withRouter(Portfolio));