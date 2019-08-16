import React, { useContext, useState, useRef, useEffect } from 'react';

import PeerContext from '../../context/peers/peersContext';

const PeerFilter = () => {
    const peerContext = useContext(PeerContext);

    const text = useRef('');

    const { filterSearch, cancel_search, killFilter, clearFilter, filtered } = peerContext;

    useEffect(() => {
        if (cancel_search) {
            text.current.value = "";
            killFilter();
        }

    }, [cancel_search]);

    // add control state to avoid clearFilter spam as for course filter buttons
    const [filtering, setFiltering] = useState(false);

    useEffect(() => {
        if (filtered === null) {
            text.current.value = '';
        }
    })

    const onChange = e => {
        if(text.current.value !== '') {
            filterSearch(e.target.value);
            setFiltering(true);
        } 
        
        if(text.current.value === '' && filtering) {
            clearFilter();
            setFiltering(false);
        }
    }

    return (
        <form>
            <input className="search-bar" type="text" ref={text} placeholder="Search..." onChange={onChange} />
        </form>
    )
}

export default PeerFilter;