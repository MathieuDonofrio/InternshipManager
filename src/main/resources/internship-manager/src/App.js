import React from 'react';
import { MemoryRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import { SnackbarProvider } from 'notistack';

import AppDrawer from './components/AppDrawer';

import AuthenticationService from './services/AuthenticationService';

import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import InternshipOfferCreationPage from './pages/InternshipOfferCreationPage';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import PortfolioDocumentPage from './pages/PortfolioDocumentPage';
import ManageAccessPage from './pages/ManageAccessPage';
import SettingsPage from './pages/SettingsPage';
import StudentListPage from './pages/StudentListPage';
import UserProfilePage from './pages/UserProfilePage';
import EmployerListPage from './pages/EmployerListPage';
import ContractListPage from './pages/ContractListPage';
import ContractPage from './pages/ContractPage';
import CreateSignaturePage from './pages/CreateSignaturePage';
import InternshipOfferListPage from './pages/InternshipOfferListPage';
import InternshipOfferPage from './pages/InternshipOfferPage';
import InternshipApplicationPage from './pages/InternshipApplicationPage';
import InternshipApplicationListPage from './pages/InternshipApplicationListPage';

function App() {

  return (
    <Router>
      <div className="App">
        <div className="container">
          <SnackbarProvider maxSnack={3}>

            <Switch>

              <Route
                exact
                path="/"
                render={() => (
                  AuthenticationService.authenticationRequired() ? <Redirect to="/login" /> : <Redirect to="/home" />
                )}
              />

              <Route exact path="/login" component={LoginPage}></Route>
              <Route exact path="/registration" component={RegistrationPage}></Route>

              <AppDrawer>

                <Route exact path="/home" component={HomePage}></Route>

                <Route exact path="/create-signature" component={CreateSignaturePage}></Route>

                <Route exact path="/internship-applications" component={InternshipApplicationListPage}></Route>
                <Route exact path="/internship-application/:uuid" component={InternshipApplicationPage}></Route>

                <Route exact path="/internship-offer-creation" component={InternshipOfferCreationPage}></Route>
                <Route exact path="/internship-offers" component={InternshipOfferListPage}></Route>
                <Route exact path="/manage-access/:uuid" component={ManageAccessPage}></Route>
                <Route exact path="/internship-offer/:uuid" component={InternshipOfferPage}></Route>

                <Route exact path="/students" component={StudentListPage}></Route>
                <Route exact path="/employers" component={EmployerListPage}></Route>
                <Route exact path="/user/:uuid" component={UserProfilePage}></Route>

                <Route exact path="/contracts" component={ContractListPage}></Route>
                <Route exact path="/contract/:uuid" component={ContractPage}></Route>

                <Route exact path="/portfolio" component={PortfolioPage}></Route>
                <Route exact path="/portfolio-document/:uuid" component={PortfolioDocumentPage}></Route>

                <Route exact path="/settings" component={SettingsPage}></Route>

              </AppDrawer>

            </Switch>
          </SnackbarProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
