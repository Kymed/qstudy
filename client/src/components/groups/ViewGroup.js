import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Join from './Join';

const ViewGroup = ({ group, closeLargeView }) => {
    const { _id, name, description, members, course, max_members } = group;
    const host =  members[0];

    const [hostProfile, setHostProfile] = useState({
        loading: true,
        success: false,
        profile: null
    });

    const { loading, success, profile } = hostProfile;

    const getHostProfile = async (id) => {
        try {
            const res = await axios.get(`api/profile/user/${id}`);

            setHostProfile({
                loading: false,
                success: true,
                profile: res.data
            })
        } catch (err) {
            setHostProfile({
                loading: false,
                success: false,
                profile: null
            });
        }
    }

    useEffect(() => {
        getHostProfile(host.user);

    }, []);

    return (
        <div className="card-md explore-group-card">
            <div className="profile-header">
                <h1 className="peer-text row-title"> {name} </h1>
                <p className="peer-text peer-small"> {course} </p>
                <h2 className="peer-text right-row-text"> {members.length}/{max_members} </h2>
            </div>
            <div className="profile-info">
                {(!loading && success) ? (
                    <div className="profile-header">
                        <h1 className="explore-text">Hosted by {profile.user.name}</h1>
                        <div className="explore-profile-group to-right">
                        <img className="explore-avatar avatar-peer-small" src={profile.user.avatar} alt='' />
                        <Link to={{
                            pathname: `/profile/${profile._id}`,
                            state: {
                                goBack: '/groups'
                            }
                        }}>
                            <button className="btn-small">Profile</button>
                        </Link>  
                        </div>
                    </div>
                ) : (
                    <Fragment>
                        <h2 className="profile-text2"> Loading Host Profile </h2>
                    </Fragment>
                )}
                <h2 className="profile-text2">{description}</h2>
            </div>
            <div className="profile-button-group">
                <button className="btn-small" onClick={() => closeLargeView(_id)}>Close</button>
                <Join group={group} />
            </div>
        </div>
    )
}

export default ViewGroup;