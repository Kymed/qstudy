import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';

import AuthContext from '../../context/auth/authContext';
import ProfileContext from '../../context/profiles/profileContext';

import Profile from '../profiles/Profile';
import ProfileView from '../profiles/ProfileView';
import CreateProfile from '../profiles/CreateProfile';

const Home = (props) => {
    const authContext = useContext(AuthContext);
    const profileContext = useContext(ProfileContext);

    const { user } = authContext;
    const { profile_exists, user_profile, loading, editing_profile} = profileContext;

    let dummyProfile = {
        name: "Kymed",
        bio: "I really like to code, go to the ARC, and smashhhh",
        year: "2022",
        courses: [
            "CISC124",
            "CISC203",
            "CISC204",
            "CISC251",
            "CISC282"
        ]
    }

    useEffect(() => {
        authContext.loadUser();
        profileContext.loadProfile();

    }, []);

    return (<section className="dash"> 
    {loading ?
        <h2> Loading </h2>
    :
        !profile_exists ?
            <Fragment>
                <h2> Looks like you don't have a profile yet. Let's create one!</h2>
                <CreateProfile />
            </Fragment>
        :       
            <Fragment>
                {editing_profile ? 
                    <CreateProfile profile={user_profile} />
                :
                    <ProfileView profile={user_profile} />
                }
            </Fragment>
    }  
            </section>
    )
}

export default Home;