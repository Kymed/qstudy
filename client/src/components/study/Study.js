import React, { useContext, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';

import StudyView from './StudyView';

import GroupsContext from '../../context/groups/groupsContext';

const Study = () => {
    const groupsContext = useContext(GroupsContext);
    const { user_groups_loading, user_groups, getUserGroups} = groupsContext;


    useEffect(() => {
        getUserGroups();

    }, []);

    return (user_groups_loading ? (
        <Fragment>
            Loading
        </Fragment>
    ) :
    (
        <Fragment>
            {user_groups.length > 0 ? (
                <StudyView />
            ) : (
                <div className="studyview-wrapper">
                    <h1 className="study-text study-header"> Looks like you're not in a group. Join or create one! </h1>
                    <Link to="/groups">
                        <button className="btn-dash">Explore</button>
                    </Link>
                    <Link to={{
                        pathname: `/newgroup`,
                        state: {
                            goBack: `/studyview`
                        }

                    }}>
                        <button className="btn-dash btn-create">Create group</button>
                    </Link>
                </div>
            )}
        </Fragment>
    )
    )
}

export default Study;