import React, { useEffect, useState, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';

import CreateGroup from '../groups/CreateGroup';
import StudyProfile from './StudyProfile';
import StudyRequests from './StudyRequests';
import StudyMembers from './StudyMembers';
import StudyInvite from './StudyInvite';
import StudyChat from './StudyChat';

import AuthContext from '../../context/auth/authContext';
import GroupsContext from '../../context/groups/groupsContext';
import AlertContext from '../../context/alert/alertContext';

const StudyView = () => {
    const authContext = useContext(AuthContext);
    const groupsContext = useContext(GroupsContext);
    const alertContext = useContext(AlertContext);

    const { user } = authContext;
    const {current, loadGroups, setGroupCurrent, user_groups} = groupsContext;
    const { setAlert } = alertContext;

    const [sidebar, collapse] = useState("sidebar-off");
    const [wrapper, changeWrapper] = useState("");
    const [isHost, setHost] = useState(false);
    const [editing, setEditing] = useState(false);

    const verifyHost = (currentGroup) => {
        let thisMember = currentGroup.members.filter(member => member.user.toString() === user._id.toString());
        if (thisMember[0].host) {
            setHost(true);
        }
    }

    const setCurrent = async (group) => {
        if (group) {
            await setGroupCurrent(group._id);
            verifyHost(group);
            setEditing(false);
        }
        else if (current !== null) {
            verifyHost(current);
            setEditing(false);
        }
        else if (current === null) {
            await setGroupCurrent(user_groups[0]._id);
            verifyHost(user_groups[0]);
            setEditing(false);
        }
    }

    useEffect(() => {
        setCurrent();

    }, [current]);

    const beginEditing = () => {
        setEditing(true);
    }

    const cancelEditing = () => {
        setEditing(false);
    }


    const reload = async () => {
        if (current !== null)
            await setGroupCurrent(current._id);
        else 
            await setGroupCurrent(user_groups[0]._id);
    }

    const collapseSidebar = () => {
        if (sidebar === "sidebar-off") {
            collapse("sidebar-on");
            changeWrapper("studyview-wrapper-desktop-smaller");
        } else {
            collapse("sidebar-off");
            changeWrapper("");
        }
    }

    return (
        <Fragment>
            {current === null ? (
                <Fragment>
                    <h2> Loading </h2>
                </Fragment>
            ) : (
                <div className={`studyview-wrapper ${wrapper}`}>
                    {editing ? (
                        <Fragment>
                            <CreateGroup existingGroup={{...current, exists: true }} finish={cancelEditing} />
                        </Fragment>
                    ) : (
                        <div className="studyview-cards">
                        <StudyProfile group={current} />
                        <StudyMembers groupid={current._id} members={current.members} reload={reload} isHost={isHost} />
                        <StudyRequests groupid={current._id} requests={current.requests} reload={reload} isHost={isHost} />
                        {isHost && 
                            <StudyInvite groupid={current._id} members={current.members} requests={current.requests} reload={reload} />
                        }
                        <StudyChat groupid={current._id}/>
                    </div>
                    )}
                    <div className="button-group">
                    <button className="btn-dash" onClick={() => collapseSidebar()}>Change group</button>
                        <button className="btn-dash btn-create" onClick={() => reload()}>Reload</button>
                        {editing ? (
                            <button className="btn-dash" onClick={() => cancelEditing()}>Stop Editing</button>
                        ) : (
                            <button className="btn-dash" onClick={() => beginEditing()}>Edit Group</button>
                        )}
                        <Link to={{
                            pathname: '/newgroup',
                            state: {
                                goBack: '/studyview'
                            }
                        }}>
                            <button className="btn-dash btn-create">Create group</button>
                        </Link>
                    </div>
                </div>
            )}
            <div className={`sidebar ${sidebar}`}>
                {sidebar === "sidebar-on" &&
                    <Fragment>
                        <a href="#!" className="btn-close" onClick={() => collapseSidebar()}><i className="fas fa-times-circle btn-close-icon"></i></a>
                        {user_groups.map(group => (
                            <h1 className="sidebar-link" key={group._id} onClick={() => setCurrent(group)}>{group.name}</h1>
                        ))}
                    </Fragment>
                }
            </div>
        </Fragment>
    )
}

export default StudyView;