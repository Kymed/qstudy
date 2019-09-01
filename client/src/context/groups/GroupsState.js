import React, { useReducer } from 'react';
import axios from 'axios';
import GroupsContext from './groupsContext';
import groupsReducer from './groupsReducer';

import { CREATE_GROUP, GROUP_CREATE_FAIL, CLEAR_ERRORS, LOGOUT, GROUPS_LOADED, GROUPS_FAIL, GROUPS_CLEAR_SEARCH, GROUPS_CLEAR_FILTER, GROUPS_FILTER_SEARCH, GROUPS_FILTER_COURSE, GROUPS_FILTER_CURRENT, GROUPS_SET_CURRENT } from '../types';

const GroupsState = props => {
    const initialState = {
        current: null,
        creation_error: null,
        groups_loaded: false,
        groups: [],
        filtered: [],
        cancel_search: false,
        loading: true,
        error: null
    }

    const [state, dispatch] = useReducer(groupsReducer, initialState);

    // Create or update group
    const uploadGroup = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            } 
        }

        try {
            const res = await axios.post('api/groups', formData, config);

            dispatch({
                type: CREATE_GROUP,
                payload: res.data
            })
        } catch (err) {
            dispatch({
                type: GROUP_CREATE_FAIL,
                payload: err.response.data.msg
            })
        }
    }

    // Load Groups
    const loadGroups = async () => {
        try {
            const res = await axios.get('api/groups/byCourse');

            let groups = res.data.map(group => ({
                ...group,
                view: 'normal'
            }));

            dispatch({
                type: GROUPS_LOADED,
                payload: groups
            })
        } catch (err) {
            dispatch({
                type: GROUPS_FAIL,
                payload: err.response.data.msg
            })
        }
    }

    // Change View State
    const changeView = (id, view) => {
        let groups = state.groups;
        if (state.filtered.length !== 0) {
            groups = state.filtered;
        }

        groups = groups.map(group => {
            if (group._id === id) {
                return {
                    ...group,
                    view
                }
            } else {
                return group;
            }
        });

        if (state.filtered.length !== 0) {
            return dispatch({
                type: GROUPS_FILTER_COURSE,
                payload: groups
            })
        }

        dispatch({
            type: GROUPS_LOADED,
            payload: groups
        })
    }
    
    // Filter by course
    const filterByCourse = course => {
        let filtered = state.groups.filter(group => group.course === course);

        filtered = filtered.map(group => ({
            ...group,
            view: 'normal'
        }));

        dispatch({
            type: GROUPS_FILTER_COURSE,
            payload: filtered
        })
    }

    // Filter by Search
    const filterSearch = text => {
        dispatch({
            type: GROUPS_FILTER_SEARCH,
            payload: text
        })
    }

    // Kill the Filter
    const killFilter = () => {
        dispatch({
            type: GROUPS_CLEAR_SEARCH
        })
    }

    // Clear the filter
    const clearFilter = () => {
        dispatch({
            type: GROUPS_CLEAR_FILTER
        })
    }

    // Logout
    const logout = () => {
        dispatch({
            type: LOGOUT
        })
    }

    // Clear errors
    const clearErrors = () => {
        dispatch({
            type: CLEAR_ERRORS
        })
    }

    return (
        <GroupsContext.Provider value={{
            current: state.current,
            creation_error: state.creation_error,
            groups: state.groups,
            filtered: state.filtered,
            cancel_search: state.cancel_search,
            loading: state.loading,
            error: state.error,
            uploadGroup,
            loadGroups,
            changeView,
            filterByCourse,
            filterSearch,
            killFilter,
            clearFilter,
            clearErrors,
            logout
        }}>
            {props.children}
        </GroupsContext.Provider>
    )
}

export default GroupsState;