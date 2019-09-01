import React, {Fragment, useEffect, useContext } from 'react';

import ProfileContext from '../../context/profiles/profileContext';
import AlertContext from '../../context/alert/alertContext';

const ProfileAlertHandler = () => {
    const profileContext = useContext(ProfileContext);
    const alertContext = useContext(AlertContext);

    const { prompt, error, clearPrompt, clearErrors } = profileContext;
    const { setAlert } = alertContext;

    useEffect(() => {
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

    }, [error, prompt]);

    return (
        <Fragment>
        </Fragment>
    )
}

export default ProfileAlertHandler;

