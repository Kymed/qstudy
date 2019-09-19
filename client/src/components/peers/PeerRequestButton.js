import React, {Fragment, useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';

import ProfileContext from '../../context/profiles/profileContext';
import PeerContext from '../../context/peers/peersContext';

/**
 * Maybe this isn't the most memory-efficent approach
 * to a dynamic button. Though it's not like theres hundreds
 * of em at once.
 */
const PeerRequestButton = ({ peerid, useThisPeerInstead = null }) => {
    const profileContext = useContext(ProfileContext);
    const peerContext = useContext(PeerContext);

    const [btn, setBtn] = useState({
        text: 'Button Loading',
        disabled: true
    });

    const { user_profile, sendBuddyRequest, loadProfile } = profileContext;
    const { peers, loadPeers } = peerContext;

    const fetchPeer = () => {
        // Fetch the peer depending if one was passed in as prop
        let findpeer;
        if (useThisPeerInstead === null) {
            // Check if the peer exists
            findpeer = peers.filter(p => p._id === peerid);
            if (findpeer.length === 0) {
                return setBtn({
                    text: 'Cannot add',
                    disabled: true
                });
            }
            return findpeer[0];
        } else { 
            return useThisPeerInstead;
        }
    }

    const findRequestState = () => {
        let { _id, user, requests } = fetchPeer();

        let exists;

        // Check if they're friends already
        exists = user_profile.buddies.filter(buddy => buddy === user._id);
        if (exists.length > 0) {
            return setBtn({
                text: 'Already friends',
                disabled: true
            })
        }

        // Check if peer sent a request
        exists = user_profile.requests.filter(request => request === user._id);
        if (exists.length > 0) {
            return setBtn({
                text: 'Accept request',
                disabled: false
            })
        }

        // Check if you have sent a request
        exists = requests.filter(request => request === user_profile.user._id);
        if (exists.length > 0) {
            return setBtn({
                text: 'Buddy request sent',
                disabled: true
            })
        }

        // Set to default
        return setBtn({
            text: 'Send buddy request',
            disabled: false
        })
    }

    useEffect(() => {
        findRequestState();

    }, [useThisPeerInstead, peers]);

    const sendRequest = async () => {
        await sendBuddyRequest(peerid);
        await loadProfile();
        await loadPeers(user_profile.courses);
    }

    const onClick = () => {
        if (!btn.disabled) {
            sendRequest();
        }
    }

    return (
        <Fragment>
            <button className="btn-small" disabled={btn.disabled} onClick={() => onClick()} >{btn.text}</button>
        </Fragment>
    )
}

export default PeerRequestButton;