import React, { useEffect, useState } from 'react';
import InternshipOfferService from '../services/InternshipOfferService';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { Box, Container, Divider } from '@material-ui/core';

//filtering services

const filterValidableStudent = async (students, internshipId) => {

  return InternshipOfferService.users(internshipId)
    .then(response => students
      .filter(student => !response.data.users.some(x => student.uniqueId == x.uniqueId)));
}

// styles

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'white',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  }
}));

//real class

export default function ValidableStudentTable(props) {

  const [rows, setRows] = useState([]);

  const classes = useStyles();

  const handleClose = () => {
    props.onClose();
  }

  const addUser = (userId) => {
    const request = { userUniqueId: userId, offerUniqueId: props.internshipId }
    InternshipOfferService.addUser(request).then(() => fetchValidableStudents());
  }

  const fetchValidableStudents = () => {
    InternshipOfferService.getAllStudent()
      .then(response => filterValidableStudent(response.data.users, props.internshipId)
        .then(students => setRows(students)));
  }

  useEffect(() => fetchValidableStudents(), []);

  return (
    <Container>
      <strong>Grant Access</strong>
      <Divider />
      <List className={classes.root}>
        {rows.length > 0 && rows.map((row, index) => (
          <ListItem key={index}>
            <ListItemText primary={row.firstName + ' ' + row.lastName} />
            <IconButton edge="end" aria-label="delete">
              <AddIcon
                onClick={() => addUser(row.uniqueId)}
              />
            </IconButton>
          </ListItem>
        ))}
        {rows.length == 0 &&
          <ListItem key={1}>
            <ListItemText primary={'No students left'} />
          </ListItem>
        }
      </List>
      <Divider />
      <Box mt={4} />
    </Container>
  );
}