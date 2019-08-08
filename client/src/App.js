import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import history from './components/history';
import './App.css';

import PrivateRoute from './components/routing/PrivateRoute';
import Landing from './components/pages/Landing';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

import AuthState from './context/auth/AuthState';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}


const App = () => {
  return (
    <AuthState>
      <Router>
          <Fragment>
            <Navbar/>
            <div className="container">
              <Switch>
                <PrivateRoute exact path="/home" component={Home} />
                <Route exact path='/' component={Landing} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/register' component={Register} />
              </Switch>
            </div>
          </Fragment>
      </Router>
    </AuthState>
  );
}

export default App;
