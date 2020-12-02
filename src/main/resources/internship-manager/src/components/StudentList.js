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
import { AppBar, Box, Tab, Tabs } from "@material-ui/core";
import UserService from '../services/UserService'

const useStyles = makeStyles({
  table: {
    minWidth: 600,
  },
});

const useStyles2 = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function StudentList() {

  const history = useHistory();
  const classes = useStyles();
  const classes2 = useStyles2();

  const [rows, setRows] = useState([]);
  const [value, setValue] = React.useState(0);
  const [title, setTitle] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchAllUsers = async () => {
    const response = await UserService.students();
    setRows(response.data.users);
    setTitle('Étudiants');
  }
  
  const fetchAllWithApplication = async () =>{
    const response = await UserService.studentsWithApplication();
    setRows(response.data.users);
    setTitle('Étudiants avec application');
  }
  
  const fetchAllWithoutApplication = async () =>{
    const response = await UserService.studentsWithoutApplication();
    setRows(response.data.users);
    setTitle('Étudiants sans application');
  }

  useEffect(() => { fetchAllUsers(); }, [])

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="tous" onClick={() => fetchAllUsers()}/>
          <Tab label="sans applications" onClick={() => fetchAllWithoutApplication()} />
          <Tab label="avec applications" onClick={() => fetchAllWithApplication()} />
        </Tabs>
      </AppBar>
      <Container>
        <Box
          mb={2}
          paddingTop={2}
          textAlign="center">

          <Typography component="h1" variant="h4">{title}</Typography>
        </Box>
      </Container>

      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>Prénom</strong></TableCell>
              <TableCell align="center"><strong>Nom</strong></TableCell>
              <TableCell align="center"><strong>Email</strong></TableCell>
              <TableCell align="center"><strong>Profil</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((student, index) => (
              <TableRow key={index}>
                <TableCell align="center">{student.firstName}</TableCell>
                <TableCell align="center">{student.lastName}</TableCell>
                <TableCell align="center">{student.email}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained" color="secondary"
                    size="small"
                    onClick={() => history.push(`/user/${student.uniqueId}`)}
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