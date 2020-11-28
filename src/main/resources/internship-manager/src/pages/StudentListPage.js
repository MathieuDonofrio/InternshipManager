import React, { Component } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import StudentList from "../components/StudentList";


export default class StudentListPage extends Component {

    //
    // Constructor
    //

    constructor(props) {
        super();
    }

    //
    // Rendering
    //

    render() {
        return (
            <div>
                <CssBaseline />
                <Container>
                    <Paper elevation={3}>
                        <StudentList />
                    </Paper>
                </Container>
            </div>
        )
    }
}