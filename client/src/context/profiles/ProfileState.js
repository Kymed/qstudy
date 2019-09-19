import React, { useReducer } from 'react';
import axios from 'axios';
import ProfileContext from './profileContext';
import profileReducer from './profileReducer';
import io from "socket.io-client";

import { PROFILE_RECIEVE_NOTIFICATION, BUDDY_REQUEST_SENT, CLEAR_PROMPTS, CLEAR_ERRORS, INITIATE_EDITING, LOGOUT, PROFILE_USER_LOADED, PROFILE_USER_SUCCESS, PROFILE_USER_FAIL, PROFILE_ERROR, PROFILES_LOADED, PROFILE_NOT_EXISTS, CLEAR_NOTIFICATIONS } from '../types';

let socket;

const ProfileState = props => {
    const initialState = {
        profile_exists: false,
        editing_profile: false,
        user_profile: null,
        loading: true,
        prompt: null,
        notification: null,
        error: null
    }

    const [state, dispatch] = useReducer(profileReducer, initialState);

    // Initialize socket
    if (!socket) {
        socket = io("http://localhost:5000");

        socket.on('notification', data => {
            console.log('recieving notification');
            dispatch({
                type: PROFILE_RECIEVE_NOTIFICATION,
                payload: data
            });
        })
    }

    // Subscribe to push notifications
    const secureSubscription = async () => {
        socket.emit('subscribe_push', {
            token: localStorage.token
        });
    }

    // Load Profile
    const loadProfile = async () => {
        // Subscribe to notifications if not already

        try {
            const res = await axios.get('api/profile/me');

            dispatch({
                type: PROFILE_USER_LOADED,
                payload: res.data
            })

            secureSubscription();

        } catch (err) {

            dispatch({
                type: PROFILE_NOT_EXISTS,
                payload: null
            })

        }
    }

    // Create or Update Profile
    const uploadProfile = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('api/profile', formData, config);

            dispatch({
                type: PROFILE_USER_SUCCESS,
                payload: res.data
            });

            loadProfile();
        } catch (err) {
            if (state.user_profile !== null) {
                return dispatch({
                    type: PROFILE_USER_FAIL,
                    payload: err.response.data.msg
                })
            }

            dispatch({
                type: PROFILE_NOT_EXISTS,
                payload: err.response.data.msg
            })
        }
    }

    // Send a friend request
    const sendBuddyRequest = async (profile_id) => {
        try {
            const res = await axios.put(`api/profile/request/${profile_id}`);

            dispatch({
                type: BUDDY_REQUEST_SENT,
                payload: res.data.msg
            });

            loadProfile();
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: err.response.data.msg
            })
        }
    }
    
    // Edit Profile
    const initiateEditing = () => {
        dispatch({
            type: INITIATE_EDITING
        });
    }

    // Logout
    const logout = () => {
        socket.emit('unsubscribe_push', {
            token: localStorage.token
        })

        dispatch({
            type: LOGOUT
        });
    }

    // Clear prompts
    const clearPrompt = () => {
        dispatch({
            type: CLEAR_PROMPTS
        })
    }

    // Clear Errors
    const clearErrors = () => dispatch({
        type: CLEAR_ERRORS
    });

    const clearNotifications = () => dispatch({
        type: CLEAR_NOTIFICATIONS
    })

    return (
        <ProfileContext.Provider value={{
            profile_exists: state.profile_exists,
            editing_profile: state.editing_profile,
            user_profile: state.user_profile,
            profiles: state.profiles,
            loading: state.loading,
            peers_loaded: state.peers_loaded,
            error: state.error,
            notification: state.notification,
            prompt: state.prompt,
            loadProfile,
            uploadProfile,
            sendBuddyRequest,
            initiateEditing,
            logout,
            clearPrompt,
            clearErrors,
            clearNotifications
        }}>
            {props.children}
        </ProfileContext.Provider>
    )
}

export default ProfileState;