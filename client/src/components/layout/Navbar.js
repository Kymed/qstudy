import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../../context/auth/authContext';

const Navbar = props => {
    const authContext = useContext(AuthContext);

    const { isAuthenticated, logout } = authContext;

    let navName = "text-center nav-item"

    const onLogout = () => {
        logout();
    }

    const authLinks = (
        <Fragment>
            <Link to="/home" className={navName}> Dashboard </Link>
            <a onClick={onLogout} href="#!" className={navName}> Logout </a>
        </Fragment>
    );

    const guestLinks = (
        <Fragment>
            <Link to="/" className={navName}>Home</Link>
            <Link to="/login" className={navName}>Login</Link>
            <Link to="/register" className={navName}>Register</Link>
        </Fragment>
    );

    return (
        <div className="navbar">
            <h1 className="navbar-brand">QStudy</h1>
            <div className="menu navs">
                {isAuthenticated ? authLinks : guestLinks}
            </div>
            <input id="menu-toggle" className="menu-toggle text-center" type="checkbox" />
            <label htmlFor="menu-toggle">
                <i className="fas fa-bars"></i>
            </label>
            <div className="menu-toggle-items">
                {isAuthenticated ? authLinks : guestLinks}
            </div>
        </div>
    )
}

export default Navbar;