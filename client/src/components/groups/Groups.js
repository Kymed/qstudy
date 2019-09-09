import React, { useEffect, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';

import Group from './Group';
import ViewGroup from './ViewGroup';
import GroupFilter from './GroupFilter';

import ProfileContext from '../../context/profiles/profileContext';
import GroupsContext from '../../context/groups/groupsContext';
import AlertContext from '../../context/alert/alertContext';

const Groups = () => {
    const profileContext = useContext(ProfileContext);
    const groupsContext = useContext(GroupsContext);
    const alertContext = useContext(AlertContext);

    const { user_profile, profile_exists } = profileContext;
    const { groups, loading, filtered, error, changeView, killFilter, filterByCourse, clearFilter, clearErrors, prompt, clearPrompts, sendJoinRequest } = groupsContext;
    const { setAlert } = alertContext;

    useEffect(() => {
        if (profile_exists) {
            groupsContext.loadGroups();
        }

    }, []);

    useEffect(() => {
        if (error !== null) {
            setAlert(error, 'danger');
            clearErrors();
        }

        if (prompt !== null) {
            setAlert(prompt, 'success');
            clearPrompts();
        }

    }, [error, prompt]);

    const isHost = (group) => {
        if (group.members[0].user === user_profile.user._id)
            return true;
        return false;
    }

    const openLargeView = (id) => {
        changeView(id, 'large');
    }

    const closeLargeView = (id) => {
        changeView(id, 'normal');
    }

    const filterButtonClick = (course) => {
        killFilter();
        filterByCourse(course);
    }

    const cancelFilter = () => {
        clearFilter();
    }

    /*const resetGroups = async () => {
        await loadProfile();
        await loadGroups();
    }

    const onClick = async (disabled, id) => {
        if (!disabled) {
            await sendJoinRequest(id);
            resetGroups();
        }
    }*/

    return (loading || groups === null ?
        (<Fragment> Loading </Fragment>)
    :
    (<div className="groups">
        {groups.length === 0 ?
            (<Fragment>
                No one has created a group yet, so maybe you should!
            </Fragment>)
            :
            (<Fragment>
                <GroupFilter />
                <div className="peers-button-group">
                    <button onClick={() => cancelFilter()} className="btn-med btn-peer">All</button>
                    {user_profile.courses.map((course, index) => (
                        <button key={index} onClick={() => filterButtonClick(course)} className="btn-med btn-peer">{course}</button>
                    ))}
                    <div className="to-right">
                        <Link to={{
                            pathname: `/newgroup`,
                            state: {
                                goBack: `/groups`
                            }
                        }}>
                            <button className="btn-med btn-create">Create Group</button>
                        </Link>
                    </div>
                </div>
                <div className="group-cards">
                    {groups.length === 0 ? 
                    (<Fragment>
                        No one else created a group yet, maybe you should!
                    </Fragment>)
                    :
                    (<Fragment>
                        {filtered.length === 0 ? 
                        (<Fragment>
                            {groups.map((group, index) => {
                                if (index > 20) return;
                                if (isHost(group)) return;
                                if (group.view === "normal") {
                                    return <Group key={group._id} group={group} openLargeView={openLargeView} />
                                } else {
                                    return <ViewGroup key={group._id} group={group} closeLargeView={closeLargeView} />
                                }
                            })}
                        </Fragment>)
                        :
                        (<Fragment>
                        {filtered.map((group, index) => {
                            if (index > 20) return;
                            if (isHost(group)) return;
                            if (group.view === "normal") {
                                return <Group key={group._id} group={group} openLargeView={openLargeView} />
                            } else {
                                return <ViewGroup key={group._id} group={group} closeLargeView={closeLargeView} />
                            }
                        })}
                        </Fragment>)
                        }
                    </Fragment>)
                    }
                </div>
            </Fragment>)
        }
    </div>)
    )
}

export default Groups;