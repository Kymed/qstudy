import React from 'react';
import { Link } from 'react-router-dom';

const StudyFriend = ({ profile, invite }) => {
    const { _id, user } = profile;
    const { name, avatar } = user;

    return (
        <div className="study-member">
            <img className="study-avatar" src={avatar} alt='' />
            <h2 className="study-text study-text-profile">{name}</h2>
            <div className="profile-buddy-buttongroup">
                <Link to={{
                    pathname: `/profile/${_id}`,
                    state: {
                        goBack: `/studyview`
                    }
                }}>
                    <button className="study-btn-profile btn-buddy-profile">Profile</button>
                </Link>
                <button className="study-btn-profile btn-create" onClick={() => invite(_id)}>Invite</button>
            </div>
        </div>
    )
}

export default StudyFriend;