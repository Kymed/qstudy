import React, { useReducer } from 'react';
import axios from 'axios';
import ProfileContext from './profileContext';
import profileReducer from './profileReducer';

import { CLEAR_ERRORS, INITIATE_EDITING, LOGOUT, PROFILE_USER_LOADED, PROFILE_USER_SUCCESS, PROFILE_USER_FAIL, PROFILE_ERROR, PROFILES_LOADED, PROFILE_NOT_EXISTS } from '../types';

const ProfileState = props => {
    const initialState = {
        profile_exists: false,
        editing_profile: false,
        user_profile: null,
        loading: true,
        error: null
    }

    const [state, dispatch] = useReducer(profileReducer, initialState);

    // Load Profile
    const loadProfile = async () => {
        try {
            const res = await axios.get('api/profile/me');

            dispatch({
                type: PROFILE_USER_LOADED,
                payload: res.data
            })

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
    
    // Edit Profile
    const initiateEditing = () => {
        dispatch({
            type: INITIATE_EDITING
        });
    }

    // Logout
    const logout = () => {
        dispatch({
            type: LOGOUT
        });
    }

    // Clear Errors
    const clearErrors = () => dispatch({
        type: CLEAR_ERRORS
    });

    return (
        <ProfileContext.Provider value={{
            profile_exists: state.profile_exists,
            editing_profile: state.editing_profile,
            user_profile: state.user_profile,
            profiles: state.profiles,
            loading: state.loading,
            peers_loaded: state.peers_loaded,
            error: state.error,
            loadProfile,
            uploadProfile,
            initiateEditing,
            logout,
            clearErrors
        }}>
            {props.children}
        </ProfileContext.Provider>
    )
}

export default ProfileState;