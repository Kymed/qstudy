import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

const Login = props => {
    const authContext = useContext(AuthContext);
    const alertContext = useContext(AlertContext);

    const { login, error, clearErrors, isAuthenticated } = authContext;
    const { setAlert } = alertContext;

    useEffect(() => {
        
        if (isAuthenticated) {
            props.history.push('/home');
        }
        
        if (error !== null) {
            setAlert(error, 'danger');
            clearErrors();
        }

        // eslint-disable-next-line
    }, [error, isAuthenticated, props.history]);

    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const { email, password } = user;

    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value});

    const onSubmit = e => {
        e.preventDefault();
        if (email === '') {
            setAlert("Please enter an email", "danger");
        } else if (password === '') {
            setAlert("Please enter a password", "danger");
        } else {
            login({
                email,
                password
            });
        }
    }

    return (<Fragment>
        <div className="sign-up-wrap">
            <div className="container text-center">
                <div className="sign-in-form card-lg">
                    <h1 className="text-center form-title"> Sign in </h1>
                    <form onSubmit={onSubmit}>
                        <label htmlFor="email">Email</label>
                        <input name="email" type="email" id="email" placeholder="Email" className="input" value={email} onChange={onChange}/>
                        <label htmlFor="password">Password</label>
                        <input name="password" type="password" id="password" placeholder="Password" className="input" value={password} onChange={onChange}/>
                        <a href="#" className="register-btn">
                            <input type="submit" value="Sign in" className="btn-primary" />
                        </a>
                        <Link to="/register">Register an account</Link>
                    </form>
                </div>
            </div>
        </div>
    </Fragment>)
}

export default Login;