import React, { useState, useContext, Fragment } from 'react'

import ProfileContext from '../../context/profiles/profileContext';

let emptyProfile = {
    bio: "",
    year: "",
    courses: []
}

const CreateProfile = ({profile = emptyProfile}) => {
    let coursesString = ""
    // TODO: Test this
    if (profile !== null) {
        profile.courses.forEach(course => coursesString = coursesString + "," + course);
    }

    const profileContext = useContext(ProfileContext);

    const [profileForm, setProfile] = useState({ ...profile, courses: coursesString});

    const { bio, year, courses } = profileForm;

    const onChange = e => setProfile({...profileForm, [e.target.name]: e.target.value});
    
    const onSubmit = e => {
        /* TODO: Add validation for Year & Courses */
        e.preventDefault();

        profileContext.uploadProfile(profileForm);
    }

    return (
        <Fragment>
            <div className="editprofile-form">
                <form onSubmit={onSubmit}>
                    <label htmlFor="bio"> Bio </label>
                    <input type="text" name="bio" id="bio" placeholder="Bio" className="input" value={bio} onChange={onChange} />
                    <label htmlFor="year"> Graduating Year </label>
                    <input type="text" name="year" id="year" placeholder="Year" className="input" value={year} onChange={onChange} />
                    <label htmlFor="bio"> Your Courses </label>
                    <input type="text" name="courses" id="courses" placeholder="BIOL102,CHEM112,MATH121..." className="input" value={courses} onChange={onChange} />
                    <h2 className="small"> Comma seperate courses, example: PSYC221,PSYC235,PSYC236,ENIN200,COMM200</h2>
                    <a href="#" className="register-btn">
                        <input type="submit" value="Save" className="btn-primary" />
                    </a>
                </form>
            </div>
        </Fragment>
    )
}

export default CreateProfile;