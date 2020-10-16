import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button, Container, Dialog, DialogTitle } from '@material-ui/core';
import ValidableStudentTable from './ValidableStudentTable';
import InternshipOfferService from '../services/InternshipOfferService';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Row } from 'react-bootstrap';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Box, Divider } from '@material-ui/core';

//dialogs

function ValidableStudentTableDialog(props) {

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Grant Access</DialogTitle>
      <ValidableStudentTable onClose={handleClose} internshipId={selectedValue} />
    </Dialog>
  );
}

ValidableStudentTableDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

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

export default function ValidatedStudentTable(props) {

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = useState([]);

  const classes = useStyles();

  const handleClose = () => {
    props.onClose();
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const removeStudent = (student) => {
    const request = { offerUniqueId: props.selectedValue, userUniqueId: student.uniqueId };
    InternshipOfferService.removeUser(request).then(() => fetchValidatedStudents());
  }

  const fetchValidatedStudents = async () => {
    const response = await InternshipOfferService.getValidatedStudent(props.selectedValue);
    setRows(response.data.users)
  }

  useEffect(() => {
    fetchValidatedStudents();
  }, [])

  return (
    <Container>
      <strong>Access List</strong>
      <Divider />
      <List className={classes.root}>
        {rows.length > 0 && rows.map((row, index) => (
          <ListItem key={index}>
            <ListItemText primary={row.firstName + ' ' + row.lastName} />
            <IconButton edge="end" aria-label="delete">
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon onClick={() => removeStudent(row)} />
              </IconButton>
            </IconButton>
          </ListItem>
        ))}
        {rows.length == 0 &&
          <ListItem key={1}>
            <ListItemText primary={'No students have access!'} />
          </ListItem>
        }
      </List>
      <Divider />
      <Box margin={2}>
        <Button variant="contained" color="primary" fullWidth onClick={handleClickOpen}>Add Students</Button>
      </Box>
      <ValidableStudentTableDialog selectedValue={props.selectedValue} open={open} onClose={handleClose} />
    </Container>
  );
}
