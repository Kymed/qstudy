import { CREATE_GROUP, CLEAR_SUCCESS, GROUP_CREATE_FAIL, CLEAR_ERRORS, LOGOUT, GROUPS_LOADED, GROUPS_FAIL, GROUPS_CLEAR_SEARCH, GROUPS_CLEAR_FILTER, GROUPS_FILTER_SEARCH, GROUPS_FILTER_COURSE, GROUPS_FILTER_CURRENT, GROUPS_SET_CURRENT } from '../types';

export default (state, action) => {
    console.log(action);
    switch(action.type) {

        case CREATE_GROUP:
            return {
                ...state,
                current: action.payload,
                creation_success: true,
                creation_error: null
            }

        case GROUP_CREATE_FAIL:
            return {
                ...state,
                current: null,
                creation_error: action.payload
            }

        case GROUPS_LOADED:
            return {
                ...state,
                groups: action.payload,
                loading: false
            }

        case GROUPS_FILTER_COURSE:
            return {
                ...state,
                cancel_search: true,
                filtered: action.payload
            }

        case GROUPS_FILTER_SEARCH:
            return {
                ...state,
                filtered: state.groups.filter(group => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return group.name.match(regex);
                }).map(group => {
                    return {...group, view: 'normal'}
                })
            }

        case GROUPS_CLEAR_SEARCH:
            return {
                ...state,
                cancel_search: false
            }

        case GROUPS_CLEAR_FILTER:
            return {
                ...state,
                cancel_search: true,
                filtered: []
            }

        case GROUPS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_SUCCESS:
            return {
                ...state,
                creation_success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                creation_error: null
            }

        case LOGOUT:
            return {
                ...state,
                current: null,
                creation_error: null,
                loading: true
            }

        default:
            return state;

    }
}