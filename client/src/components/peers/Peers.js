import React, { useState, useEffect, useContext, Fragment } from 'react';

import Peer from './Peer';
import ViewPeer from './ViewPeer';
import PeerFilter from './PeerFilter';

import ProfileContext from '../../context/profiles/profileContext';
import PeersContext from '../../context/peers/peersContext';

const Peers = props => {
    const profileContext = useContext(ProfileContext);
    const peersContext = useContext(PeersContext);

    const { user_profile, profile_exists, clear } = profileContext;
    const { peers, peers_loaded, clearFilter, killFilter, filterByCourse, filtered, changeView, loading, error } = peersContext;

    useEffect(() => {
        if (profile_exists) {
            peersContext.loadPeers(user_profile.courses);
        }
    }, []);

    const openLargeView = (id) => {
        changeView(id, 'large');
    }

    const closeLargeView = (id) => {
        changeView(id, 'normal');
    }

    const filterButtonClick = (course) => {
        killFilter();
        filterByCourse(course);
    }

    const cancelFilter = () => {
        clearFilter();
    }

    return (loading || peers === null ? 
            (<Fragment> Loading </Fragment>) 
        : 
        (<div className="peers">
            <PeerFilter />
            <div className="peers-button-group">
                <button onClick={() => cancelFilter()} className="btn-med btn-peer">All</button> 
                {user_profile.courses.map((course, index) => (
                    <button key={index} onClick={() => filterButtonClick(course)} className="btn-med btn-peer">{course}</button>
                ))}
            </div>

            {filtered.length === 0 ? 
                peers.map((peer, index) => {
                    if (index > 10) return;
                    if (peer.view === "normal") {
                        return <Peer key={peer._id} openLargeView={openLargeView} profile={peer} />
                    } else {
                        return <ViewPeer key={peer._id} closeLargeView={closeLargeView} profile={peer} />
                }})
            : 
                filtered.map((peer, index) => {
                    if (index > 10) return;
                    if (peer.view === "normal") {
                        return <Peer key={peer._id} openLargeView={openLargeView} profile={peer} />
                    } else {
                        return <ViewPeer key={peer._id} closeLargeView={closeLargeView} profile={peer} />
                }})
            }
        </div>)
    )
}

export default Peers