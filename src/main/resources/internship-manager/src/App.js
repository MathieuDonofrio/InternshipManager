import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import AppDrawer from './components/AppDrawer';

import AuthenticationService from './services/AuthenticationService';

import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import InternshipOfferCreationPage from './pages/InternshipOfferCreationPage';
import HomePage from './pages/HomePage';

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

            </AppDrawer>


          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
