import React, { useEffect, useState, useContext, Fragment } from 'react'

import ProfileContext from '../../context/profiles/profileContext';
import ProfileView from './ProfileView';

import CreateProfile from './CreateProfile';

const Profile = () => {
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

    return (
        <Fragment>

        </Fragment>
    )
}

export default Profile;