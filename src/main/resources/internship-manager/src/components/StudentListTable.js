import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import UserService from '../services/UserService'

const useStyles = makeStyles({
    table: {
        minWidth: 600,
    },
});

export default function StudentListTable() {

    const history = useHistory();
    const classes = useStyles();

    const [rows, setRows] = useState([]);

    const fetchAllUsers = async () => {
        const response = await UserService.students();
        setRows(response.data.users);
    }

    useEffect(() => { fetchAllUsers(); }, [])

    return (
        <div>
        <Container>
          <Box
            mb={2}
            paddingTop={2}
            textAlign="center">
  
            <Typography component="h1" variant="h4">Students</Typography>
          </Box>
        </Container>
  
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Email</strong></TableCell>
                <TableCell align="center"><strong>First name</strong></TableCell>
                <TableCell align="center"><strong>Last name</strong></TableCell>
                <TableCell align="center"><strong>Profil</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((student,index) => (
                <TableRow key={index}>
                  <TableCell align="center">{student.email}</TableCell>
                  <TableCell align="center">{student.firstName}</TableCell>
                  <TableCell align="center">{student.lastName}</TableCell>
                  <TableCell align="center"> 
                  <Button
                      variant="contained" color="secondary"
                      size="small"
                      onClick={() => history.push(`/student-profile-page/${student.uniqueId}`)}
                    >
                      Voir profil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
}