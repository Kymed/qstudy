const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator/check');

const Profile = require('../models/Profile');
const Group = require('../models/Group');
const User = require('../models/User');

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

// TEMPORARY TEST ROUTE TODO: Use then remove
// @route  GET api/profile/groupsTheUserHosts
// @desc   Gets all groups that the user hosts
// @access Private
router.get('/groupsTheUserHosts', auth, async (req, res) => {
    try {
        /* ********TODO******** */
        // Test the route 
        /* ********TODO******** */
        const groups = await Group.find({ members: { user: req.user.id, host: true } });
        res.json(groups);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// TEMPORARY TEST ROUTE TODO: Use then remove
// @route  GET api/profile/groupsWhereUserIsOnlyHost
// @desc   Gets all groups that the user is the only host
// @access Private
router.get('/groupsWhereUserIsOnlyHost', auth, async (req, res) => {
    try {
        /* ********TODO******** */
        // Test the route 
        /* ********TODO******** */

        // Find the groups the user is the only host in, remove them
        let remove = true;
        const groups = await Group.find({ members: { user: req.user.id, host: true } });
        const groupsToRemove = groups.filter(group => {

            // For every group, filter out every group that doesn't have a host
            remove = true;
            group.members.foreach(member => {
                if (member.host === True && member.user !== req.user.id) {
                    remove = false;
                }
            });
            return remove;

        });

        res.json(groupsToRemove);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  DELETE api/profile
// @desc   Delete profile, user, groups, and events
// @access Private
router.delete('/', auth, async (req, res) => {
    try {
        /* ********TODO******** */
        // Test the route 
        /* ********TODO******** */

        // Find the profile and check if it exists
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(401).json({ msg: 'You did not make your profile yet' });
        }

        // Find the groups the user is the only host in, remove them
        let remove = true;
        const groups = await Group.find({ members: { user: req.user.id, host: true } });
        const groupsToRemove = groups.filter(group => {

            // For every group, filter out every group that doesn't have a host
            remove = true;
            group.members.foreach(member => {
                if (member.host === True && member.user !== req.user.id) {
                    remove = false;
                }
            });
            return remove;

        });

        // Get the IDs of the groups to remove
        const groupsToRemoveIDs = groupsToRemove.map(group => group.id);

        // Find all the events the group owns
        const eventsToRemove = await Event.find({ group: { $in: groupsToRemoveIDs }})

        // Delete the events and the groups
        await eventsToRemove.remove();
        await groupsToRemove.remove();

        // Remove Profile & User
        await profile.remove();
        await User.findByIdAndRemove(req.user.id);

        // Return
        res.json({ msg: `User ${req.user.id} deleted`});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
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

// @route  PUT api/profile/group/:group_id
// @desc   Add group to profile
// @access Private
router.put('/group/:group_id', auth, async (req, res) => {
    try {
        // Get profile and check if it exists
        const profile = await Group.findById(req.user.id);
        if (!profile) {
            return res.status(401).json({ msg: 'You did not make your profile yet' });
        }

        // Get group to check if it exists
        const group = await Group.findById(req.params.group_id);
        if (!group) {
            return res.status(401).json({ msg: 'Server not found' });
        }

        // Verify that the user is joined in the group
        let index = group.members.map(member => member.user).indexOf(req.params.group_id);
        if (index < 0) {
            return res.status(401).json({ msg: 'User is not part of this group'});
        }

        // Add the group to user's profile and save then return
        profile.groups.unshift(req.params.group_id);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route  DELETE api/profile/group/:group_id
// @desc   Delete group from profile
// @access Private
router.delete('/group/:group_id', auth, async (req, res) => {
    try {

        // Get profile and check if it exists
        const profile = await Group.findById(req.user.id);
        if (!profile) {
            return res.status(401).json({ msg: 'You did not make your profile yet' });
        }

        // Get group to check if it exists
        const group = await Group.findById(req.params.group_id);
        if (!group) {
            return res.status(401).json({ msg: 'Server not found' });
        }

        // Verify that the user is joined in the group
        let index = group.members.map(member => member.user).indexOf(req.params.group_id);
        if (index < 0) {
            return res.status(401).json({ msg: 'User is not part of this group'});
        }

        // Remove the user from the group, save & return
        profile.groups.splice(index, 1);
        await profile.save();
        res.json(profile);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  GET api/profile/invites
// @desc   Get all group invites
// @access Private

// @route  PUT api/profile/invites/:group_id
// @desc   Join the group in an invite
// @access Private
// Remember to make sure the invite exists

// @route  DELETE api/profile/invites/:group_id
// @desc   Remove an invite
// @access Private

module.exports = router;