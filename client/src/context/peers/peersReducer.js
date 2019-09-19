import {PEERS_CLEAR_SEARCH, PEERS_FILTER_CURRENT, PEERS_LOADED, PEERS_CLEAR_FILTER, PEERS_FAIL, PEERS_CHANGE_VIEW, PEERS_FILTER_SEARCH, PEERS_FILTER_COURSE, PEERS_SET_CURRENT, CLEAR_ERRORS, LOGOUT } from '../types';

export default (state, action) => {
    console.log(action);
    switch(action.type) {

        case PEERS_LOADED:
            return {
                ...state,
                peers: action.payload,
                peers_loaded: true,
                loading: false
            };

        case PEERS_FAIL:
            return {
                ...state,
                peers_loaded: false,
                error: action.payload
            }
        
        case PEERS_FILTER_COURSE:
            return {
                ...state,
                cancel_search: true,
                filtered: [...action.payload],
            }

        case PEERS_FILTER_SEARCH:
            return {
                ...state,
                filtered: state.peers.filter(peer => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return peer.user.name.match(regex);
                }).map(peer => {
                    return {...peer, view: 'normal'}
                })
            }

        case PEERS_CLEAR_FILTER:
            return {
                ...state,
                cancel_search: true,
                filtered: []
            }

        case PEERS_CLEAR_SEARCH:
            return {
                ...state,
                cancel_search: false
            }

        case LOGOUT:
            return {
                peers_loaded: false,
                peers: [],
                current: null,
                filtered: [],
                loading: true,
                error: null
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;


    }
}