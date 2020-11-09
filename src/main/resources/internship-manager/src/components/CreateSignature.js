import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
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
import Divider from '@material-ui/core/Divider';
import LockOutlined from '@material-ui/icons/LockOutlined';
import PortfolioService from "../services/PortfolioService";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import * as ReactBootStrap from "react-bootstrap";
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
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { DropzoneArea } from 'material-ui-dropzone';
import { saveAs } from 'file-saver';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Popup from "reactjs-popup";
import SignaturePad from "react-signature-canvas";
import "./signCanvas.css";



export default function CreateSignature(){

    const [imageURL, setImageURL] = useState(null); // creer un state qui va contenir l'url de l'image

    const [open, setOpen] = useState(false);

    const sigCanvas = useRef({});


    /* 
        une fonction qui utilise la référence du canevas pour effacer le canevas
        via une méthode donnée par react-signature-canvas
    */

    const clear = () => sigCanvas.current.clear();


    /* 
        une fonction qui utilise la référence du canevas pour découper le canevas
        à partir d'espaces blancs via une méthode donnée par react-signature-canvas
        puis le sauvegarde dans notre statwe
    */

    const save = () => {
        setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
        handleClose();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    return(

            <div>

                <Box
                    mb={2}
                    paddingTop={2}
                    textAlign="center">
                    <Typography component="h1" variant="h5">Créer une signature</Typography>
                </Box>

                <Divider />

                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    Créer une signature
                </Button>

                <Dialog
                    open={open}
                    onClose={handleClose}
                >

                    <DialogContent
                        style={{ backgroundColor: 'lightGray' }}
                    >
                            <SignaturePad
                                ref={sigCanvas}
                                canvasProps={{
                                    className: "signatureCanvas"
                                  }}
                            />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                        <Button onClick={save} color="primary">
                            Save
                        </Button>
                        <Button onClick={clear} color="primary">
                            Clear
                        </Button>
                    </DialogActions>

                </Dialog>
                <br />
                <br />
                {/* if our we have a non-null image url we should 
                show an image and pass our imageURL state to it*/}
                {imageURL ? (
                    <img
                    src={imageURL}
                    alt="my signature"
                    style={{
                        display: "block",
                        margin: "0 auto",
                        border: "1px solid black",
                        width: "150px"
                    }}
                    />
                ) : null}
                

            </div>

    );

}