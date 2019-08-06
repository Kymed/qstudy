const Profile = require('../models/Profile');

// This server side notification utility function was a fun idea.
// Felt weird to making something that was so similiar to an endpoint, but not an endpoint.
// For the server itself to use. 

module.exports = async (notification, profileid) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!notification.message) {
                reject('message is missing');
                return;
            }

            const profile = await Profile.findById(profileid)
            if (!profile) {
                reject('A server-side notification attempted to send to a non-existing profile');
                return;
            }

            const { message, group, event } = notification;
            const notificationFields = {};

            if (message) notificationFields.message = message;
            if (group) notificationFields.group = group;
            if (event) notificationFields.event = event;

            profile.notifications.push(notificationFields);
            await profile.save();

            console.log(`Server successfully sent a notification to ${profile._id}`);
            resolve(profile);
        } catch (err) {
            console.error(err.message);
            reject('Error sending notification');
        }
    });
} 