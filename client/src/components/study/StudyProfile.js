import React from 'react';

const StudyProfile = ({ group }) => {
    return (
        <div className="study-card">
            <h1 className="study-text study-header">{group.name}</h1>
            <h2 className="study-text">{group.description}</h2>
            <h2 className="study-text study-sm">{group.course}</h2>
            <h2 className="study-text">{group.members.length}/{group.max_members}</h2>
        </div>
    )
}

export default StudyProfile;