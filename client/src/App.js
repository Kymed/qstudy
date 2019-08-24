import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import history from './components/history';
import './App.css';

import PrivateRoute from './components/routing/PrivateRoute';
import ProfileRoute from './components/routing/ProfileRoute';
import Landing from './components/pages/Landing';
import Navbar from './components/layout/Navbar';
import Alerts from './components/layout/Alerts';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Peers from './components/peers/Peers';
import Profile from './components/pages/Profile';

import ProfileAlertHandler from './components/profiles/ProfileAlertHandler';

import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import ProfileState from './context/profiles/ProfileState';
import PeersState from './context/peers/PeersState';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const GlobalState = (props) => {
  return (
    <AuthState>
      <AlertState>
        <ProfileState>
            <PeersState>
              {props.children}
            </PeersState>
        </ProfileState>
      </AlertState>
    </AuthState>
  )
}

const App = () => {
  return (
    <GlobalState>
        <Router>
            <Fragment>
              <Navbar/>
              <div className="container">
                <Switch>
                  <PrivateRoute exact path="/home" component={Home} />
                  <ProfileRoute exact path="/peers" component={Peers} />
                  <ProfileRoute exact path="/profile/:id" component={Profile} />
                  <Route exact path='/' component={Landing} />
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/register' component={Register} />
                </Switch>
              </div>
              <ProfileAlertHandler />
              <Alerts />
            </Fragment>
        </Router>
      </GlobalState>
    
  );
}

export default App;
