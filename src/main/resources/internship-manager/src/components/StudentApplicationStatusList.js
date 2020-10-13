import InternshipApplicationService from "../services/InternshipApplicationService";

//
// Data
//

const { Component } = require("react");
const { default: StudentInternshipApplicationStatus } = require("../pages/StudentInternshipApplicationStatus");

const state = {
    studentApplicationsList = []
}

 
class StudentApplicationStatusList extends Component{

    //
    // Constructors
    //

    constructor(props){
        super();
        this.state = state;
        this.onUpdateStudentApplicationsList();
        this.submitLock = new Lock();
    }

    //
    // Event Handlers
    //

    onUpdateStudentApplicationsList(){
        userId =localStorage.getItem("UserUniqueId");
        InternshipApplicationService.internshipApplications(userId).then(response =>{
            this.setState(response.data);
        })
    }

    //
    // Rendering
    //

    renderTableData() {
        return this.state.studentApplicationsList.map((studentAppList, index) => {
          const { offerUniqueId, date, status} = studentAppList
          return (
            <TableRow key={index}>
              <TableCell component="th" scope="row" align="center">{offerUniqueId}</TableCell>
              <TableCell component="th" scope="row" align="center">{new Date(date).toLocaleDateString()}</TableCell>
              <TableCell component="th" scope="row" align="center">{status}</TableCell>
            </TableRow>
    
          )
        })
    }

    render() {
      return (
        <div>
          <Container>
            <Box
              mb={2}
              paddingTop={2}
              textAlign="left"
            >
              <Typography component="h1" variant="h4" align="center">Applications Status</Typography>
            </Box>
          </Container>
  
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"><strong>Offer Unique Id</strong></TableCell>
                  <TableCell align="center"><strong>Date</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.renderTableData()}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
  
  
      )
    }




}