import React, { Fragment, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ProfileContext from '../../context/profiles/profileContext';

const ProfileView = ( {profile} ) => {
    const { user, bio, year, courses } = profile;
    const { avatar } = user;

    let courseElements = courses.map((course, index) =>
    <li key={index} className="profile-text"> {course} </li>
    );

    const profileContext = useContext(ProfileContext);

    let editProfile = () => {
        profileContext.initiateEditing();
    }

    return (
        <div className="profile-view">
            <div className="card-md profile-card">
                <div className="profile-header">
                    <h1 className="profile-text"> Welcome, {user.name} </h1>

                    <img className="avatar" src={avatar} alt='' />
                </div>

                <div className="profile-info">
                    <h2 className="profile-text"> {bio} </h2>
                    <h2 className="profile-text2"> Year: {year} </h2>
                    <ul className="course-list"> {courseElements} </ul>
                </div>
            </div>

            <button className="btn-dash" onClick={editProfile}> Edit Profile </button>
            <Link to={{
                pathname: "/newgroup",
                state: {
                    goBack: "/home"
                }
            }}>
                <button className="btn-dash btn-create">Create Group</button>
            </Link>
            <Link to='/studyview'>
                <button className="btn-dash btn-peer">Study</button>
            </Link>
        </div>
    )
}

export default ProfileView;