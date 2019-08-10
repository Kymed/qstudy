import React, { useContext, Fragment } from 'react';

import AlertContext from '../../context/alert/alertContext';

const Alerts = props => {
    const alertContext = useContext(AlertContext);

    const { alerts } = alertContext;

    return (<div className="alerts">
            {alerts.length > 0 && alerts.map(alert => (
                <div key={alert.id} className={`alert alert-${alert.type}`}>
                    <i className="fas fa-info-circle alert-icon" />{' '} {' '}{alert.msg}
                </div>
            ))}
    </div>)
}

export default Alerts;