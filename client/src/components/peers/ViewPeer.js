import React, { Fragment, useContext } from 'react';

import PeerRequestButton from './PeerRequestButton';

const ViewPeer = ({ profile, closeLargeView }) => {
    const { _id, user, bio, year, courses } = profile;
    const { avatar } = user;

    let courseElements = courses.map((course, index) =>
    <li key={index} className="profile-text"> {course} </li>
    );

    return (
        <Fragment>
            <div className="card-md peer-card peer-margin">
                <div className="profile-header">
                    <h1 className="peer-text"> {user.name} </h1>

                    <img className="avatar avatar-peer" src={avatar} alt='' />
                </div>

                <div className="profile-info">
                    <h2 className="profile-text"> {bio} </h2>
                    <h2 className="profile-text2"> Year: {year} </h2>
                    <ul className="course-list"> {courseElements} </ul>

                    <div className="profile-button-group">
                        <button onClick={() => closeLargeView(_id)} className="btn-small"> Close </button>
                        <PeerRequestButton peerid={_id} useThisPeerInstead={profile} />
                    </div>
                </div>
            </div>
            </Fragment>
    )
}

export default ViewPeer;