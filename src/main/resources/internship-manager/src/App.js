import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import AppDrawer from './components/AppDrawer';

import AuthenticationService from './services/AuthenticationService';

import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import InternshipOfferCreationPage from './pages/InternshipOfferCreationPage';
import HomePage from './pages/HomePage';
import StudentInternshipOfferValidationPage from './pages/StudentInternshipOfferValidationPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import Portfolio from './components/Portfolio';
import PortfolioPage from './pages/PortfolioPage';
import StudentInternshipApplicationPage from './pages/StudentInternshipApplicationPage';
import StudentInternshipApplicationValidationPage from './pages/StudentInternshipApplicationValidationPage';
import StudentInternshipApplicationStatus from './pages/StudentInternshipApplicationStatus';

function App() {
  
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Switch>

            <Route
              exact
              path="/"
              render={() => {
                return (
                  AuthenticationService.authenticationRequired() ?
                    <Redirect to="/login" /> :
                    <Redirect to="/home" />
                )
              }}
            />

            <Route exact path="/login" component={LoginPage}></Route>
            <Route exact path="/registration" component={RegistrationPage}></Route>

            <AppDrawer>

              <Route exact path="/home" component={HomePage}></Route>

              <Route exact path="/internshipoffercreation" component={InternshipOfferCreationPage}></Route>
              
              <Route exact path="/studentoffervalidation" component={StudentInternshipOfferValidationPage}></Route>
              <Route exact path="/pending-approval" component={PendingApprovalPage}></Route>

              <Route exact path="/internship-application-creation" component={StudentInternshipApplicationPage}></Route>
              <Route exact path="/portfolio" component={PortfolioPage}></Route>

              <Route exact path="/internship-application-validation" component={StudentInternshipApplicationValidationPage}></Route>
              <Route exact path="/internship-application-status" component={StudentInternshipApplicationStatus}></Route>


            </AppDrawer>


          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
