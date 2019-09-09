import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StudyRequest = ({userid, accept, deny, isHost}) => {
    const [profileState, setProfile] = useState({
        loading: true,
        exists: false,
        profile: {
            user: {}
        }
    });

    const getProfile = async () => {
        try {
            const res = await axios.get(`../api/profile/user/${userid}`);

            setProfile({
                loading: false,
                exists: true,
                profile: res.data
            })
        } catch (err) {
            setProfile({
                loading: false,
                exists: false,
                profile: null
            })
        }
    }

    const { profile, loading, exists } = profileState;

    useEffect(() => {
        getProfile();

    }, []);

    const { _id, user } = profile;
    const { name, avatar } = user;

    return (loading ?
        (
            <Fragment>
                <h2 className="study-text">Loading</h2>
            </Fragment>
        ) :
        (
            <Fragment>
                {exists ? (
                    <div className="study-member">
                        <img className="study-avatar" src={avatar} alt='' />
                        <h2 className="study-text study-text-profile">{name}</h2>
                        <div className="profile-buddy-buttongroup">
                        <Link to={{
                            pathname: `/profile/${_id}`,
                            state: {
                                goBack: `/studyview`
                            }
                        }}>
                            <button className="study-btn-profile btn-buddy-profile">Profile</button>
                        </Link>
                        {isHost && 
                            <Fragment>
                                <button className="study-btn-profile btn-buddy-accept" onClick={() => accept(userid)}>Accept</button>
                                <button className="study-btn-profile btn-buddy-decline" onClick={() => deny(userid)}>Deny</button>
                            </Fragment>
                        }
                    </div>
                    </div>
                ) : (
                    <Fragment>
                        <h2 className="study-text">Error loading profile</h2>
                    </Fragment>
                )}
            </Fragment>
        )
    )
}

export default StudyRequest;