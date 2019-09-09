import React, { useEffect, useContext, Fragment, useState } from 'react';
import axios from 'axios';

import StudyFriend from './StudyFriend';

import AlertContext from '../../context/alert/alertContext';

const StudyInvite = ({ groupid, members, requests, reload }) => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

    const [budProfiles, setBudProfiles] = useState({
        profiles: null,
        loading: true,
        empty: false
    });

    const { profiles, loading, empty } = budProfiles;

    const filterBuddies = (profiles) => {
        profiles = profiles.filter(profile => {
            // Check if they're in the group already
            let filterIndex = members.filter(member => member.user.toString() === profile.user._id.toString());
            if (filterIndex.length > 0) {
                return false;
            }

            // Check if they have sent a request already
            filterIndex = requests.filter(request => request.toString() === profile.user._id.toString());
            if (filterIndex.length > 0) {
                return false;
            }

            // Check if an invite was already sent
            filterIndex = profile.invites.filter(invite => invite.toString() === groupid.toString());
            if (filterIndex.length > 0) {
                return false;
            }

            return true;
        });

        setBudProfiles({
            profiles,
            loading: false,
            empty
        });
    }

    const getBuddies = async () => {
        try {
            const res = await axios.get(`../api/profile/buddyProfiles`);

            if (res.data.length === 0) {
                return setBudProfiles({
                    profiles: null,
                    loading: false,
                    empty: true
                });
            }

            filterBuddies(res.data);
        } catch (err) {
            setBudProfiles({
                profiles: null,
                loading: true,
                empty: true
            });
        }
    }

    const inviteRequest = async (profileid) => {
        try {
            const res = await axios.put(`../api/groups/invite/${groupid}/${profileid}`);

            setAlert(res.data.msg, 'success');
        } catch (err) {
            setAlert(err.response.data.msg, 'danger');
        }
    }

    const invite = async (profileid) => {
        await inviteRequest(profileid);
        await reload();
        getBuddies();
    }

    useEffect(() => {
        getBuddies();

    }, []);

    return (
        <div className="study-card">
            {loading ? (
                <Fragment>
                    <p className="study-text">Loading</p>
                </Fragment>
            ) : (
                <Fragment>
                    {empty ? (
                        <Fragment>
                            <p className="study-text">You have no friends to invite</p>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <h1 className="study-text study-header">Invite</h1>
                            {profiles.map(profile => (
                                <StudyFriend key={profile._id} profile={profile} invite={invite} />
                            ))}
                        </Fragment>
                    )}
                </Fragment>
            )} 
        </div>
    )
}

export default StudyInvite;