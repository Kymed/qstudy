import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

import './auth.css';

const Register = props => {
    const authContext = useContext(AuthContext);
    const alertContext = useContext(AlertContext);

    const { register, error, clearErrors, isAuthenticated } = authContext;
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
        name: '',
        email: '',
        password: '',
        password2: '',
    })

    const { name, email, password, password2 }  = user;

    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value});

    const onSubmit = e => {
        e.preventDefault();
        if (name === '' || email === '' || password === '') {
            setAlert('Please enter all fields', 'danger');
        } else if (password !== password2) {
            setAlert('Passwords do not match', 'danger');
        } else {
            register({
                name, 
                email,
                password
            })
        }
    }

    return (
        <Fragment>
        <div className="sign-up-wrap">
            <div className="container text-center">
                <div className="sign-in-form card-lg">
                    <h1 className="text-center form-title"> Sign up</h1>
                        <form onSubmit={onSubmit}>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" placeholder="Name" className="input" value={name} onChange={onChange}/>
                            <label htmlFor="email">Email</label>
                            <input name="email" type="email" id="email" placeholder="Email" className="input" value={email} onChange={onChange}/>
                            <h2 className="small"> Our site uses gravatar </h2>
                            <label htmlFor="password">Password</label>
                            <input name="password" type="password" id="password" placeholder="Password" className="input" value={password} onChange={onChange}/>
                            <label htmlFor="password">Confirm Password</label>
                            <input name="password2" type="password" id="password" placeholder="Password" className="input" value={password2} onChange={onChange}/>
                            <a href="#" className="register-btn">
                                <input type="submit" value="Sign up" className="btn-primary"/>
                            </a>
                            <Link to="/login">Log in!</Link>
                        </form>
                    
                </div>
            </div>
        </div>
    </Fragment>
    )
}

export default Register;