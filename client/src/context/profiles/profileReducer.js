import { LOGOUT, CLEAR_ERRORS, INITIATE_EDITING, PROFILE_NOT_EXISTS, PROFILE_USER_LOADED, PROFILE_USER_SUCCESS, PROFILE_USER_FAIL, PROFILE_ERROR, PROFILES_LOADED } from '../types';

export default (state, action) => {
    console.log(action);
    switch(action.type) {
        case PROFILE_USER_LOADED:
            return {
                ...state,
                profile_exists: true,
                user_profile: action.payload,
                loading: false
            }
        
        case PROFILE_NOT_EXISTS:
            return {
                ...state,
                profile_exists: false,
                loading: false,
                error: action.payload
            }

        case PROFILE_USER_SUCCESS:
            return {
                ...state,
                editing_profile: false
            }
        
        case INITIATE_EDITING:
            return {
                ...state,
                editing_profile: true
            }
        
        case PROFILE_USER_FAIL:
            return {
                ...state,
                profile_exists: true,
                error: action.payload
            }

        case LOGOUT:
            return {
                profile_exists: false,
                editing_profile: false,
                user_profile: null,
                profiles: [],
                loading: true,
                peers_loaded: false,
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