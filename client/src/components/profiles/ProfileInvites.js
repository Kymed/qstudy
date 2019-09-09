import React, { useContext, useState, useEffect, Fragment } from 'react';
import axios from 'axios';

import ProfileInvite from './ProfileInvite';

import ProfileContext from '../../context/profiles/profileContext';
import AlertContext from '../../context/alert/alertContext';

const ProfileInvites = () => {
    const profileContext = useContext(ProfileContext);
    const alertContext = useContext(AlertContext);
    
    const { loadProfile, user_profile } = profileContext;
    const { setAlert } = alertContext; 

    const [groupsState, setGroups] = useState({
        groups: null,
        loading: true,
        success: true
    });
    
    const {groups, loading, success} = groupsState;

    const getGroups = async () => {
        try {
            const res = await axios.get('api/profile/invites');

            setGroups({
                groups: res.data,
                loading: false,
                success: true
            });
        } catch (err) {
            setGroups({
                groups: null,
                loading: false,
                success: false
            })
        }
    }

    useEffect(() => {
        getGroups();

    }, [user_profile]);

    const joinRequest = async (groupid) => {
        try {
            const res = await axios.put(`api/profile/invites/${groupid}`);

            setAlert(res.data.msg, 'success');
        } catch (err) {
            setAlert(err.response.data.msg, 'danger');
        }
    }

    const denyRequest = async (groupid) => {
        try {
            const res = await axios.delete(`api/profile/invites/${groupid}`);

            setAlert(res.data.msg, 'success')
        } catch (err) {
            setAlert(err.response.data.msg, 'danger');
        }
    }

    const join = async (groupid) => {
        await joinRequest(groupid);
        loadProfile();
    }

    const deny = async (groupid) => {
        await denyRequest(groupid);
        loadProfile();
    }

    return (!loading && (
                <Fragment>
                    {success ? (
                        <div className="group-cards">
                            {groups.map(group => (
                                <ProfileInvite key={group._id} group={group} join={join} deny={deny} />
                            ))}
                        </div>
                    ) : (
                        <Fragment>
                            <h2> Failure loading invites </h2>
                        </Fragment>
                    )}
                </Fragment>
            )
    )
}

export default ProfileInvites;