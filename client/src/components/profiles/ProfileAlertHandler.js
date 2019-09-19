import React, {Fragment, useEffect, useContext } from 'react';
import io from "socket.io-client";

import ProfileContext from '../../context/profiles/profileContext';
import AlertContext from '../../context/alert/alertContext';

const ProfileAlertHandler = () => {

    const profileContext = useContext(ProfileContext);
    const alertContext = useContext(AlertContext);

    const { prompt, error, notification, clearPrompt, clearErrors, clearNotifications } = profileContext;
    const { setAlert } = alertContext;

    useEffect(() => {
        if (notification !== null) {
            setAlert(notification, 'success');
            clearNotifications();
        }

        if (prompt !== null) {
            setAlert(prompt, 'success');
            clearPrompt();
        }

        if (error !== null) {
            if (Array.isArray(error)) {
                error.forEach(err => setAlert(err, 'danger'));
            } else {
                setAlert(error, 'danger');
            }
            clearErrors();
        }

    }, [error, prompt, notification]);

    return (
        <Fragment>
        </Fragment>
    )
}

export default ProfileAlertHandler;

