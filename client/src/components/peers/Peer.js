import React, { Fragment, useContext } from 'react';


const Peer = ({ profile, openLargeView }) => {
    const { _id, user, bio, year, courses } = profile;
    const { avatar } = user;

    return (<Fragment>
        <div className="peer-card-small peer-margin">
            <div className="profile-header">
                <h1 className="peer-text row-title"> {user.name} </h1>
                <p className="peer-text peer-small"> {year} </p>
                <img className="avatar avatar-peer-small" src={avatar} alt='' />
            </div>
            <button onClick={() => openLargeView(_id)} className="btn-small"> More </button>
        </div>
     </Fragment>)
}

export default Peer;