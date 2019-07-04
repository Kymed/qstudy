const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator/check');

const Profile = require('../models/Profile');
const Group = require('../models/Group');

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

// @route  DELETE api/profile
// @desc   Delete profile, user & posts
// @access Private
router.delete('/', auth, async (req, res) => {
    try {
        /* ********TODO******** */
        // Get the group of the profile
        // Get all events based on that group
        // Delete both the group and the events
        /* ********TODO******** */

        /* ********TODO******** */
        // Test this route
        /* ********TODO******** */

        // Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Remove profile
        await User.findOneAndRemove({ _id: req.user.id });
        
        res.json({ msg: `User ${req.user.id} deleted`});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  PUT api/profiles/buddy/:buddy_id
// @desc   Add buddy to profile
// @access Private
router.put('/buddy/:buddy_id', auth, async (req, res) => {
    try {
        /* ********TODO******** */
        // Test this route
        /* ********TODO******** */
        const profile = await Profile.findOne({ user: req.user.id });

        profile.buddies.unshift(req.params.buddy_id);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  DELETE api/profiles/buddy/:buddy_id
// @desc   Delete buddy from profile
// @access Private
router.delete('/buddy/:buddy_id', auth, async (req, res) => {
    try {
        /* ********TODO******** */
        // Test this route
        /* ********TODO******** */
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.buddies.indexOf(req.params.buddy_id);

        profile.buddies.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// @route  DELETE api/profiles/group/:group_id
// @desc   Delete group from profile
// @access Private

// @route  PUT api/profiles/group
// @desc   Add group to profile
// @access Private

module.exports = router;