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
            <h2 className="p-1 landing-subtitle"> An academic micro Social Media </h2>
            <p className="p-1 landing-p"> Don't know anyone in your classes? Can't find any or all the facebook groups for your courses? Know a quiet spot on campus or got a nice living room and would like to host a cram?
                QStudy is an application for students at Queen's University to form online or in-person study groups and cram sessions, built and designed to solve such problems. </p>
        </section>
    )
}

export default Landing;