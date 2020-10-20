import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { withRouter } from 'react-router';
import Lock from '../utils/Lock'

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import InternshipOfferService from "../services/InternshipOfferService";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InternshipApplicationService from "../services/InternshipApplicationService";
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import PortfolioService from "../services/PortfolioService";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';


const useStyles = makeStyles({
  table: {
    minWidth: 800,
  },
});

export default function StudentDetailsList (props) {

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = useState([]);

  const classes = useStyles();

  const handleClose = () => {
    props.onClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const fetchPortfolioDocuments = async () => {
    const response = await  PortfolioService.portfolioDocuments(props.selectedValue);
    setRows(response.data.portfolioDocuments)
    console.log(response.data.portfolioDocuments);
  }

  useEffect(() => {
    fetchPortfolioDocuments();
  }, [])



  return (
    <div>
      <Container>
        <Box
          mb={2}
          paddingTop={2}
          textAlign="left"
        >
          <Typography component="h1" variant="h4" align="center">List Of Documents</Typography>
        </Box>
      </Container>

      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>File Name</strong></TableCell>
              <TableCell align="center"><strong>Type</strong></TableCell>
              <TableCell align="center"><strong>Upload Date</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row,index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" align="center">{row.fileName}</TableCell>
                <TableCell component="th" scope="row" align="center">{row.type}</TableCell>
                <TableCell component="th" scope="row" align="center">{new Date(row.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell omponent="th" scope="row" >


                  <Box margin={1}>
                    <Button
                      variant="contained" color="secondary"
                      size="small"
                      startIcon={<CloudDownloadIcon />}
                    >
                      Download
                    </Button>
                  </Box>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={handleClose} color="primary" fullWidth>close</Button>
    </div>
  );
}