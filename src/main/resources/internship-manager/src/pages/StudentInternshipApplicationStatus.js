import { Component } from "react";


import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import StudentApplicationStatusList from "../components/StudentApplicationStatusList"

export default class StudentInternshipApplicationStatus extends Component{

    //
    // Constructors
    //

    constructor(props){
        super();
    }

    //
    // Rendering
    //

    render(){
        return(
            <div>
                <CssBaseline />

                <Container>

                    <Paper elevation={3}>

                        <StudentApplicationStatusList/>
                    </Paper>

                </Container>

            </div>
        )
    }

}