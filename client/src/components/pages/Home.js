import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';

import AuthContext from '../../context/auth/authContext';
import ProfileContext from '../../context/profiles/profileContext';

import ProfileView from '../profiles/ProfileView';
import CreateProfile from '../profiles/CreateProfile';

const Home = (props) => {
    const authContext = useContext(AuthContext);
    const profileContext = useContext(ProfileContext);

    const { user, loading } = authContext;
    const { profile_exists, user_profile, editing_profile} = profileContext;

    const profileLoading = profileContext.loading;

    useEffect(() => {
        authContext.loadUser();
        profileContext.loadProfile();

    }, []);

    return (<section className="dash"> 
    {loading || profileLoading ?
        <h2> Loading </h2>
    :
        !profile_exists ?
            <CreateProfile prompt="Looks like you don't have a profile yet. Let's create one!" />
        :       
            <Fragment>
                {editing_profile ?
                    <CreateProfile prompt="Edit Your Profile" profile={user_profile} />
                :
                    <ProfileView profile={user_profile} />
                }
            </Fragment>
    }  
            </section>
    )
}

export default Home;