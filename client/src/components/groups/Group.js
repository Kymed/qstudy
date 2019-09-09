import React, { Fragment } from 'react';

import Join from './Join';

const Group = ({ group, openLargeView }) => {
    const { _id, name, course, members, max_members } = group;

    return (
        <div className="card-row">
            <div className="profile-header">
                <h1 className="peer-text row-title"> {name} </h1>
                <p className="peer-text peer-small"> {course} </p>
                <h2 className="peer-text right-row-text"> {members.length}/{max_members} </h2>
            </div>
            <div className="profile-button-group">
                    <button className="btn-small" onClick={() => openLargeView(_id)}> More </button>
                    <Join group={group} />
            </div>
        </div>
    )
}

export default Group;