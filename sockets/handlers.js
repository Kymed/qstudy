const jwt = require('jsonwebtoken');
const config = require('config');

const Group = require('../models/Group');

/**
 * Verify the user that sent the socket event,
 * from the JWT, for accurate identification
 */
const verifyUser = (data) => {
    const token = data.token;
    if (!token) {
        return "invalid";
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        return decoded.user.id.toString();
    } catch (err) {
        return "invalid";
    }
}

/**
 * Verify they are a member of the group in which they claim.
 */
const verifyMember = async (userid, data) => {
    try {
        // Get the group
        const group = await Group.findById(data.group);
        if (!group) return false;

        // Check if the user is a member of the group
        const memberIndex = group.members.map(member => member.user.toString()).indexOf(userid);
        if (memberIndex < 0) return false;

        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Handle a message sent to the server,
 * get the user and send it to all the clients
 * in the room
 */
const recieveMessage = async (data, io) => {
    if (!data.group) return;

    let result = verifyUser(data);
    if (result === "invalid") return;

    const verification = await verifyMember(result, data);
    if (verification === true) { 
        io.in(`group-${data.group}`).emit('message_sent', {
            from: result,
            msg: data.msg
        });
    }
}

/**
 * Handle the request to subscribe to a room
 * and handle all the necessary verifications
 * for the user to join that room
 */
const subscribeToGroup = async (data, socket) => {
    if (!data.group) return;

    let result = verifyUser(data);
    if (result === "invalid") return;

    const verification = await verifyMember(result, data);
    if (verification === true) {
        socket.join(`group-${data.group}`);
    }
}

/**
 *  Join room to listen for push notifications
 */
const subscribeToPush = async (data, socket) => {
    let result = verifyUser(data);
    if (result === "invalid") return;

    socket.join(`user-${result}`);
}

/**
 *  Unsubscribe from a Group
 */
const unsubscribeToGroup = async (data, socket) => {
    try {
        socket.leave(`group-${data.groupid}`);
    } catch (err) {
        return;
    }
}

/**
 *  Unsubscribe from push notifications
 */
const unsubscribeToPush = async (data, socket) => {
    try {
        let result = verifyUser(data);
        if (result === "invalid") return;
        socket.leave(`user-${result}`);
    } catch (err) {
        return;
    }
}

module.exports = {
    recieveMessage,
    subscribeToGroup,
    subscribeToPush,
    unsubscribeToGroup,
    unsubscribeToPush
};