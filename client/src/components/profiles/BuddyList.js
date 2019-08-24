import React, {Fragment, useState, useEffect, useContext} from 'react';
import axios from 'axios';

import BuddyRow from './BuddyRow';

import AlertContext from '../../context/alert/alertContext';

const BuddyList = ({ refreshBuddies, setRefreshBuddies }) => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

    const [budProfiles, setBudProfiles] = useState({
        profiles: null,
        empty: null
    });

    const getBuddies = async () => {
        try {
            const res = await axios.get(`api/profile/buddyProfiles`);

            let empty = true;
            if (res.data.length > 0) {
                empty = false
            }

            setBudProfiles({
                profiles: res.data,
                empty
            });
        } catch (err) {
            return <div className="card-md buddy-card"><h2> Problem Loading Buddies </h2></div>
        }
    }

    const remove = async (profileid) => {
        try {
            const res = await axios.delete(`api/profile/buddy/${profileid}`);

            setAlert('Successfully removed', 'success');
            getBuddies();
        } catch (err) {
            setAlert(err.response.data.msg, 'danger');
        }
    }

    useEffect(() => {
        if (refreshBuddies) {
            getBuddies();
            setRefreshBuddies(false);
        }

    }, [refreshBuddies]);

    useEffect(() => {
        getBuddies();

    }, []);

    return (
        <div className="card-md buddy-card">
            {budProfiles.empty === null ?
                (<h3>Loading </h3>)
            :
                (<Fragment>
                    {budProfiles.empty ? (
                        <Fragment>
                            <h2> You have no buddies </h2>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <h1 className="requests-title">Buddies</h1>
                            {budProfiles.profiles.map(profile => (
                                <BuddyRow key={profile._id} profile={profile} remove={remove} />
                            ))}
                        </Fragment>
                    )}
                </Fragment>)
            }
        </div>
    )
}

export default BuddyList;