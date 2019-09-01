import React, { useReducer } from 'react';
import axios from 'axios';
import PeersContext from './peersContext';
import peersReducer from './peersReducer';

import {PEERS_LOADED, PEERS_FILTER_CURRENT, PEERS_CLEAR_SEARCH, PEERS_CLEAR_FILTER, PEERS_FAIL, PEERS_FILTER_SEARCH, PEERS_FILTER_COURSE, PEERS_SET_CURRENT, CLEAR_ERRORS, LOGOUT } from '../types';

const PeersState = props => {
    const initialState = {
        peers_loaded: false,
        peers: [],
        current: null,
        filtered: [],
        cancel_search: false,
        loading: true,
        error: null,
    }

    const [state, dispatch] = useReducer(peersReducer, initialState);

    // Load peers
    const loadPeers = async (courses) => {
        if (courses === null) {
            return dispatch({
                type: PEERS_FAIL
            })
        }

        let coursesString = ""
        courses.forEach(course => coursesString = coursesString + "," + course);
        coursesString = coursesString.substring(1, coursesString.length);

        try {
            const res = await axios.get(`/api/profile/byCourse/${coursesString}`);

            let peers = res.data.map(peer => ({
                ...peer,
                view: 'normal'
            }));

            dispatch({
                type: PEERS_LOADED,
                payload: peers
            })
        } catch (err) {
            dispatch({
                type: PEERS_FAIL,
                payload: err.response.data.msg
            })
        }
    }

    // Change View State 
    const changeView = (id, view) => {
        // Map through the peers, changing the view state of the one intended
        let peers = state.peers;
        if (state.filtered.length !== 0) {
            peers = state.filtered;
        }

        peers = peers.map(peer => {
            if (peer._id === id) {
                return {
                    ...peer,
                    view    
                }
            } else {
                return peer;
            }
        });

        if (state.filtered.length !== 0) {
            return dispatch({
                type: PEERS_FILTER_COURSE,
                payload: peers
            })
        }

        dispatch({
            type: PEERS_LOADED,
            payload: peers
        });
    }

    // Filter by course
    const filterByCourse = course => {
        let filtered = state.peers.filter(peer => peer.courses.includes(course));

        filtered = filtered.map(peer => ({
            ...peer,
            view: 'normal'
        }));

        dispatch({
            type: PEERS_FILTER_COURSE,
            payload: filtered
        });
    }

    // Filter by Search
    const filterSearch = text => {
        dispatch({
            type: PEERS_FILTER_SEARCH,
            payload: text
        })
    }

    // Kill the filter
    const killFilter = () => {
        dispatch({
            type: PEERS_CLEAR_SEARCH
        })
    }

    // Clear Filter
    const clearFilter = () => {
        dispatch({
            type: PEERS_CLEAR_FILTER
        })
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
        <PeersContext.Provider value={{
            peers_loaded: state.peers_loaded,
            peers: state.peers,
            current: state.current,
            filtered: state.filtered,
            cancel_search: state.cancel_search,
            loading: state.loading,
            error: state.error,
            loadPeers,
            filterSearch,
            filterByCourse,
            changeView,
            killFilter,
            clearFilter,
            clearErrors,
            logout
        }}>
            {props.children}
        </PeersContext.Provider>
    )
}

export default PeersState;