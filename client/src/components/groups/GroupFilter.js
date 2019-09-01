import React, { useContext, useState, useRef, useEffect } from 'react';

import GroupsContext from '../../context/groups/groupsContext';

const GroupFilter = () => {
    const groupsContext = useContext(GroupsContext);

    const text = useRef('');

    const { filterSearch, cancel_search, killFilter, clearFilter, filtered } = groupsContext;

    useEffect(() => {
        if (cancel_search) {
            text.current.value = "";
            killFilter();
        }

    }, [cancel_search]);

    const [filtering, setFiltering] = useState(false);

    useEffect(() => {
        if (filtered === null) {
            text.current.value = '';
        }
    });

    const onChange = e => {
        if (text.current.value !== '') {
            filterSearch(e.target.value);
            setFiltering(true);
        }

        if (text.current.value === '' && filtering) {
            clearFilter();
            setFiltering(false);
        }
    }

    return (
        <div className="search-bar-wrapper">
            <form>
                <input className="search-bar" type="text" ref={text} placeholder="Search..." onChange={onChange} /> 
            </form>
        </div>
    )

}

export default GroupFilter;