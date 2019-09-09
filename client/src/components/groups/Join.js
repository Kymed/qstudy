import React, { useEffect, useState, useContext } from 'react';

import ProfileContext from '../../context/profiles/profileContext';
import GroupsContext from '../../context/groups/groupsContext';
import AlertContext from '../../context/alert/alertContext';

const Join = ({ group }) => {
    const profileContext = useContext(ProfileContext);
    const groupsContext = useContext(GroupsContext);
    const alertContext = useContext(AlertContext)

    const [state, setState] = useState({
        disabled: true,
        text: "Loading"
    })

    const { disabled, text } = state;
    const { user_profile, loadProfile } = profileContext;
    const { user, invites } = user_profile;
    const { prompt, error, clearErrors, clearPrompts, sendJoinRequest, loadGroups, groups } = groupsContext;
    const { setAlert } = alertContext;

    // Make requests and use logic to get the state of the button
    const getState = async () => {
        // Check if a member
        let filter = group.members.filter(member => member.user.toString() === user._id.toString());
        if (filter.length > 0) {
            return setState({
                disabled: true,
                text: "You've joined"
            })
        }

        // Check if invited
        filter = invites.filter(invite => invite.toString() === group._id.toString());
        if (filter.length > 0) {
            return setState({
                disabled: false,
                text: "Accept Invite"
            })
        }

        // Check if requested
        filter = group.requests.filter(request => request.toString() === user._id.toString());
        if (filter.length > 0) {
            return setState({
                disabled: true,
                text: "Request sent"
            })
        }

        return setState({
            disabled: false,
            text: "Join"
        })
    }

    const resetGroups = async () => {
        await loadProfile();
        await loadGroups();
    }

    useEffect(() => {
        getState();

    }, [groups]);

    const onClick = async () => {
        if (!disabled) {
            await sendJoinRequest(group._id);
            resetGroups();
        }
    }

    return (
        <button className={`btn-small`} disabled={disabled} onClick={() => onClick()}>{text}</button>
    )
}

export default Join;