const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator/check');

const Profile = require('../models/Profile');
const Group = require('../models/Group');
const User = require('../models/User');

/*
    TODO: Delete adding groups & deleting group routes, and groups array in model.
    Make an endpoint for querying groups by user.
*/

// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
                                .populate('user',
                                ['name', 'avatar']);
        
        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user'});
        }

        res.json(profile); 
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST api/profile
// @desc   Create or update a user profile
// @access Private
router.post('/', [auth, [
    check('courses', 'Courses are required').not().isEmpty(),
    check('year', 'A year is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { bio, courses, year } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if (bio) profileFields.bio = bio;
    if (year) profileFields.year = year;

    if (courses) {
        profileFields.courses = courses.split(',').map(course => course.trim());
    }

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            let profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            });
            
            return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user id
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Profile not found'});

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server error');
    }
});


// @route  GET api/profile/groups
// @desc   Gets all groups that the user is in
// @access Private
// This O(N^2) Algo makes me uncomfortable but it's the best option right now
// As array-subdoc querying is not working for me. At a scale this is unacceptable.
router.get('/groups', auth, async (req, res) => {
    try {

        let allGroups = await Group.find().sort({ date: -1 });
        let groups = new Array();
        allGroups.some(group => {
            group.members.some(member => {
                if (member.user.toString() === req.user.id) {
                    return groups.push(group);
                }
            })
        });

        res.json(groups);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  GET api/profile/groupsAsHost
// @desc   Get all the groups in which the user hosts
// @access Private
router.get('/groupsAsHost', auth, async (req, res) => {
    try {

        let allGroups = await Group.find().sort({ date: -1 });
        let groups = new Array();
        allGroups.some(group => {
            group.members.some(member => {
                if (member.user.toString() === req.user.id && member.host === true) {
                    return groups.push(group);
                }
            })
        });

        res.json(groups);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  PUT api/profile/buddy/:buddy_id
// @desc   Add buddy to profile
// @access Private
router.put('/buddy/:buddy_id', auth, async (req, res) => {
    try {
        // Get the users profile and check if it exists
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(401).json({ msg: 'You did not make your profile yet' });
        }

        // Check if the user they're trying to 'add' exists
        const user = await User.findById(req.params.buddy_id);
        if (!user) {
            return res.status(401).json({ msg: 'The user to friend does not exist' });
        }

        // Add the new buddy, save & return
        profile.buddies.unshift(req.params.buddy_id);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  DELETE api/profile/buddy/:buddy_id
// @desc   Delete buddy from profile
// @access Private
router.delete('/buddy/:buddy_id', auth, async (req, res) => {
    try {
        // Get the user's profile and check if it exists  
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(401).json({ msg: 'You did not make your profile yet' });
        }

        // Get remove index, see if they were buddies in the first place
        const removeIndex = profile.buddies.indexOf(req.params.buddy_id);
        if (removeIndex < 0) {
            return res.status(400).json({ msg: `You are not friends with ${req.params.buddy_id}`});
        }

        // Unfriend the buddy, save & return
        profile.buddies.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// @route  GET api/profile/invites
// @desc   Get all group invites
// @access Private
router.get('/invites', auth, async (req, res) => {
    try {

        /* Get user & profile and check if profile exists */
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'Profile has not been created yet, make one' });
        }

        /* Query for the invites and return */
        res.json(profile.invites);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  PUT api/profile/invites/:group_id
// @desc   Join the group in an invite
// @access Private
router.put('/invites/:group_id', auth, async (req, res) => {
    try {
        /* get the profile and check if it exists */
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not created yet'});
        }

        /* get the group and check if it exists */
        const group = await Group.findById(req.params.group_id);
        if (!group) {
            return res.status(404).json({ msg: 'Group not found'});
        }

        /* Make sure the user isn't already in the group */
        let joiningUser = group.members.filter(member => member.user.toString() === req.user.id.toString());
        if (joiningUser.length > 0) {
            return res.status(401).json({ msg: 'You are already in this group'});
        }

        /* Check if the invite actually exists */
        let inviteIndex = profile.invites.map(invite => invite.toString()).indexOf(req.params.group_id);
        if (inviteIndex < 0) {
            return res.status(401).json({ msg: 'You were not sent an invite by this group' });
        }

        /* Check if the group has a set max_member count, and validate */
        if (group.max_members) {
            if (group.members.length === group.max_members) {
                return res.status(400).json({ msg: 'Group\'s max member count as been reached' });
            }
        }

        /* Because of my conditions in the endpoint, group requests
        don't need to be resolved, cause you can't send an invite
        if a member requested, as the two will cancel out and the user
        will auto join the group
        */

        /* Add member and return */
        profile.invites.splice(inviteIndex, 1);
        group.members.push({ user: req.user.id, host: false });
        await group.save();
        await profile.save();
        res.json({ msg: `You have been added to ${group.name}`});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  DELETE api/profile/invites/:group_id
// @desc   Remove an invite
// @access Private
router.delete('/invites/:group_id', auth, async (req, res) => {
    try {

        /* Get the profile and check if it exists */
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'You have not made your profile yet'});
        }

        /* Check if the invite exists */
        let inviteIndex = profile.invites.map(invite => invite.toString()).indexOf(req.params.group_id);
        if (inviteIndex < 0) {
            return res.status(400).json({ msg: 'You did not recieve an invite from this group'});
        }

        /* Remove the invite and return */
        profile.invites.splice(inviteIndex, 1);
        await profile.save();
        res.json({ msg: 'Invite successfully denied' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  POST api/profile/notifications/:profile_id
// @desc   Send a new notification
// @access Private
router.post('/notifications/:profile_id', [auth, [
    check('message').not().isEmpty()
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const fromProfile = await Profile.findOne({ user: req.user.id });
        if (!fromProfile) {
            return res.status(404).json({ msg: 'You have not created a profile yet' });
        }

        const toProfile = await Profile.findOne({ user: req.params.profile_id }).populate('user', ['name']);
        if (!toProfile) {
            return res.status(404).json({ msg: 'The profile you\'re sending to does not exist' });
        }

        const { message, group, event } = req.body;
        const notificationFields = {};

        if (message) notificationFields.message = message;
        if (group) notificationFields.group = group;
        if (event) notificationFields.event = event;

        toProfile.notifications.push(notificationFields);
        await toProfile.save();
        res.json({ msg: `Notification successfully sent to ${toProfile.user.name}` });


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  GET api/profile/notifications
// @desc   Get all notifications
// @access Private
router.get('/notifications', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'You have not created your profile yet' });
        }
        console.log(profile);
        res.json(profile.notifications);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  DELETE api/profile/notifications/:id
// @desc   Remove a notification
// @access Private
router.delete('/notifications/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'Profile does not exist yet'});
        }

        let removeIndex = profile.notifications.map(notification => notification._id).indexOf(req.params.id);
        if (removeIndex < 0) {
            return res.status(400).json({ msg: 'Notification does not exist' });
        }

        profile.notifications.splice(removeIndex, 1);
        await profile.save();
        res.json({ msg: 'Notification successfully removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;