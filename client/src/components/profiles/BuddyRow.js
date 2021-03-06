import React from 'react';
import { Link } from 'react-router-dom';

const BuddyRow = ({profile, remove}) => {
    const { _id, user } = profile;
    const { name, avatar } = user;

    return (
        <div className="profile-buddy-row">
            <img className="requests-avatar" src={avatar} alt='' />
            <h1 className="requests-text">{name}</h1>
            <div className="profile-buddy-buttongroup">
                <Link to={{
                        pathname: `/profile/${_id}`,
                        state: {
                            goBack: `/home`
                        }
                }}>
                    <button className="btn-buddy btn-buddy-profile">Profile</button>
                </Link>
                <button className="btn-buddy btn-buddy-decline" onClick={() => remove(_id)}>Remove</button>
            </div>
         </div>
    )
}

export default BuddyRow;