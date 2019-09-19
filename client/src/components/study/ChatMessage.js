import React from 'react';

const ChatMessage = ({ profile, message }) => {
    const { name } = profile.user;

    return (
        <div className={`study-chat-message`}>
            <p className={`study-text`}>{name}: {message}</p>
        </div>
    )
}

export default ChatMessage;