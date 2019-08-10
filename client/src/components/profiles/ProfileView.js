import React, { Fragment, useContext, useEffect } from 'react';

import ProfileContext from '../../context/profiles/profileContext';

const ProfileView = ( {profile} ) => {
    const { name, bio, year, courses } = profile;
    let courseElements;
    useEffect(() => {
        courseElements = courses.map((course, index) =>
            <li key={index}> {course} </li>
        );
    }, []);

    const profileContext = useContext(ProfileContext);

    let editProfile = () => {
        profileContext.initiateEditing();
    }

    return (
        <Fragment>
            <h1 className="profile-label"> Welcome, {name} </h1>

            <h2 className="profile-sublabel"> Bio: {bio} </h2>

            <h2 className="profile-sublabel"> Year: {year} </h2>

            {/* Display the courses they're enrolled in */}
            <p className="profile-p"> 
                You're enrolled in </p>
                <ul className="course-list">
                    {courseElements}
                </ul>

            <button className="btn-primary" onClick={editProfile}> Edit Profile </button>
        </Fragment>
    )
}

export default ProfileView;