import React, { useState, useContext, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const Home = () => {
    const authContext = useContext(AuthContext);

    const { isAuthenticated, loading, user } = authContext;

    useEffect(() => {
        authContext.loadUser();

    }, []);

    return (
        <section>
            <h1> QStudy </h1>
            <h2> Home </h2> 
        </section>
    )
}

export default Home;