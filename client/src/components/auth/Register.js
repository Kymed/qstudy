import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../../context/auth/authContext';

import './auth.css';

const Register = props => {
    const authContext = useContext(AuthContext);

    const { register, error, clearErrors, isAuthenticated } = authContext;

    const [alert, setAlert] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            props.history.push('/home');
        }

        if (error === 'User already exists') {
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
            setAlert('Please enter all fields');
        } else if (password !== password2) {
            setAlert('Passwords do not match');
        } else {
            register({
                name, 
                email,
                password
            })
            setAlert('success');
        }
    }

    return (
        <Fragment>
        <div className="sign-up-wrap">
            <div className="container text-center">
                <div className="sign-in-form card-lg">
                    <h1 className="text-center form-title"> Sign up</h1>
                    <h2> {alert} </h2>
                        <form onSubmit={onSubmit}>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" placeholder="Name" className="input" value={name} onChange={onChange}/>
                            <label htmlFor="email">Email</label>
                            <input name="email" type="email" id="email" placeholder="Email" className="input" value={email} onChange={onChange}/>
                            <label htmlFor="password">Password</label>
                            <input name="password" type="password" id="password" placeholder="Password" className="input" value={password} onChange={onChange}/>
                            <label htmlFor="password">Confirm Password</label>
                            <input name="password2" type="password" id="password" placeholder="Password" className="input" value={password2} onChange={onChange}/>
                            <a href="#" class="register-btn">
                                <input type="submit" value="Sign up" class="btn-primary"/>
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