import React, { useState, useContext, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const Landing = () => {
    const authContext = useContext(AuthContext);

    const { isAuthenticated } = authContext;

    useEffect(() => {
        if (isAuthenticated) {
            return <Redirect to='/home'/>;
        }
    }, [isAuthenticated]);

    return (
        <section className="landing">
            <h1 className="p-1 landing-title"> QStudy </h1>
            <h2 className="p-1 landing-subtitle"> An Academic Micro Social Media </h2>
            <p className="p-1 landing-p"> Don't know anyone in your classes? Can't find a facebook group for one of your courses? Don't want to make a Facebook? Want to meet others in your classes?
                QStudy is an application for students at Queen's University to form study groups. </p>
        </section>
    )
}

export default Landing;