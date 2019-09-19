import React, { useEffect, useContext, useState, useRef, Fragment } from 'react';
import io from "socket.io-client";
import uuid from 'uuid';
import axios from 'axios';

import ChatMessage from './ChatMessage';

import GroupsContext from '../../context/groups/groupsContext';

const StudyChat = ({ groupid }) => {
    const socket = useRef(null);
    const socketroom = useRef(null);
    const msgField = useRef('');
    const scrollBar = useRef(null);
    const scrolling = useRef(false);

    const groupsContext = useContext(GroupsContext);
    const { current } = groupsContext;

    const [groupProfiles, setGroupProfiles] = useState({
        profiles: [],
        loading: true,
        error: false
    });

    const [messages, setMessages] = useState({
       texts: [] 
    });

    const { profiles, loading, error } = groupProfiles;

    const connectToServer = async () => {

        if (socketroom.current === null) {
            socket.current = await io("http://localhost:5000");

            // Listen for message events
            socket.current.on('message_sent', data => { 
                setMessages(prevMessages => ({
                    texts: [...prevMessages.texts, {
                        ...data,
                        id: uuid.v4()
                    }]
                }));
            });
        } else {
            // Unsubscribe from previous room if there was one
            if (socketroom.current !== groupid) {
                socket.current.emit('unsubscribe', {
                    groupid: socketroom.current
                });
            }
        }
        socketroom.current = groupid;

        // Subscribe to the new room
        socket.current.emit('subscribe', {
            group: groupid,
            token: localStorage.token
        });
    }

    const resetProfiles = async () => {
        setGroupProfiles({
            profiles: [],
            loading: true,
            error: false
        })
    }

    const getGroupProfiles = async () => {
        try {
            const res = await axios.get(`../api/groups/memberProfiles/${groupid}`);

            setGroupProfiles({
                profiles: res.data,
                loading: false,
                error: false
            })
        } catch (err) {
            setGroupProfiles({
                profiles: [],
                loading: false,
                error: true
            })
        }
    }

    const getProfileOfMessage = (message) => {
        let userid = message.from;
        let index = profiles.map(profile => profile.user._id.toString()).indexOf(userid.toString());
        if (index < 0) {
            return {
                user: {
                    name: "Unloaded User",
                    _id: " "
                }
            }
        } else {
            return profiles[index]
        }
    }

    const sendMessage = () => {
        if (msgField.current.value !== "") {
            socket.current.emit('send_message', {
                token: localStorage.token,
                group: groupid,
                msg: msgField.current.value
            });
            msgField.current.value = "";
        }
    }

    const handleScroll = () => {
        if (scrollBar.current !== null && scrolling.current === false) {
            scrollBar.current.scrollTop = scrollBar.current.scrollHeight;
        }
    }

    const onScroll = () => {
        scrolling.current = true;
        if (scrollBar.current.scrollHeight - scrollBar.current.scrollTop === 216) {
            scrolling.current = false;
        }
    }

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    useEffect(() => {
        setMessages({ texts: [] });
        resetProfiles();
        getGroupProfiles();
        connectToServer();

    }, [groupid]);

    useEffect(() => {
        handleScroll();

    }, [messages]);

    return (<div className="study-card study-card-lg">
        {loading ? (
            <Fragment>
                <h2 className="study-text">Loading</h2>
            </Fragment>
        ) : (
            <Fragment>
                {error ? (
                    <Fragment>
                        <h2 className="study-text">Error loading chat</h2>
                    </Fragment>
                ) : (
                    <Fragment>
                        <div className="chat-wrapper">
                            <h1 className="study-text study-header"> Chat </h1>
                            <div className="overflow-wrapper">
                                <div className="messages-wrapper" ref={scrollBar} onScroll={() => onScroll()}>
                                    {messages.texts.map(message => (
                                        <ChatMessage key={message.id} profile={getProfileOfMessage(message)} message={message.msg} />
                                    ))}
                                </div>
                            </div>
                            <div className="chat-bar-wrapper">
                                <input type="text" className="chat-bar" ref={msgField} placeholder="Message..." onKeyPress={(e) => onKeyPress(e)} />
                                <button className="btn-chat" onClick={() => sendMessage()}>Send</button>
                            </div>
                        </div>
                    </Fragment>
                )}
            </Fragment>
        )}
    </div>)
}

export default StudyChat;