import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';

import AlertContext from '../../context/alert/alertContext';

import StudyMember from './StudyMember';


const StudyMembers = ({groupid, members, reload, isHost}) => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

    const kickMember = async (userid) => {
        try {
            await axios.delete(`../api/groups/members/${groupid}/${userid}`);

            setAlert('Member successfully kicked', 'success');
        } catch (err) {
            setAlert('Failed to kick', 'danger');
        }
    }

    const kick = async (userid) => {
        await kickMember(userid);
        reload();
    }

    return (
        <div className="study-card">
            <h1 className="study-text study-header"> Members </h1>
            {members.map(member =>
                (<StudyMember key={member._id} userid={member.user} kick={kick} isHost={isHost} />)
            )}
        </div>
    )
}

export default StudyMembers;