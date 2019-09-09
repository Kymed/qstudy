import React, { useContext } from 'react';
import axios from 'axios';

import StudyRequest from './StudyRequest';

import AlertContext from '../../context/alert/alertContext';

const StudyRequests = ({groupid, requests, reload, isHost}) => {
    const alertContext = useContext(AlertContext);

    const { setAlert } = alertContext;

    const acceptRequest = async (userid) => {
        try {
            await axios.put(`../api/groups/members/${groupid}/${userid}`);

            setAlert('Request successfully accepted', 'success');
        } catch (err) {
            setAlert('Failed to accept', 'danger');
        }
    }

    const denyRequest = async (userid) => {
        try {   
            await axios.delete(`../api/groups/requests/${groupid}/${userid}`)

            setAlert('Request successfully resolved', 'success');
        } catch (err) {
            setAlert('Failed to deny', 'danger');
        }
    }

    const accept = async (userid) => {
        await acceptRequest(userid);
        reload();
    }

    const deny = async (userid) => {
        await denyRequest(userid);
        reload();
    }

    return (
        <div className="study-card">
            <h1 className="study-text study-header"> Requests </h1>
            {requests.map (request => 
                (<StudyRequest key={request} userid={request} accept={accept} deny={deny} isHost={isHost} />)
            )}
        </div>
    )
}

export default StudyRequests;