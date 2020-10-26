import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box } from "@material-ui/core";
import InternshipOfferService from '../services/InternshipOfferService';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles({
  table: {
    minWidth: 600,
  },
});

export default function StudentInternshipValidationTable() {

  const history = useHistory();
  const classes = useStyles();

  const [rows, setRows] = useState([]);

  const fetchInternshipOffers = async () => {
    const response = await InternshipOfferService.approved();
    setRows(response.data.internshipOffers);
  }

  useEffect(() => { fetchInternshipOffers(); }, [])

  return (
    <div>
      <Container>
        <Box
          mb={2}
          paddingTop={2}
          textAlign="center">

          <Typography component="h1" variant="h4">Accès aux offres</Typography>
        </Box>
      </Container>

      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>Compagnie</strong></TableCell>
              <TableCell align="center"><strong>Titre du post</strong></TableCell>
              <TableCell align="center"><strong>Date de début</strong></TableCell>
              <TableCell align="center"><strong>Durée</strong></TableCell>
              <TableCell align="center"><strong>Heures</strong></TableCell>
              <TableCell align="center"><strong>Gérer l'accès</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((offer,index) => (
              <TableRow key={index}>
                <TableCell align="center">{offer.company}</TableCell>
                <TableCell align="center">{offer.jobTitle}</TableCell>
                <TableCell align="center">{new Date(offer.startDate).toLocaleDateString()}</TableCell>
                <TableCell align="center">{offer.duration}</TableCell>
                <TableCell align="center">{offer.hours}</TableCell>
                <TableCell align="center"> 
                  <IconButton edge="end" aria-label="edit">
                    <EditIcon onClick={() => history.push(`/manage-access/${offer.uniqueId}`)}/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}