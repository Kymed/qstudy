const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Group = require('../../models/Group');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

/*
    TO(Maybe)DO: Create some middleware to make sure the requesting user is a group member,
    and a host.
*/

// @route  POST api/groups
// @desc   Create or update a group
// @access Public
router.post('/', [auth, [
    check('name', 'Name is required').not().isEmpty(),
    check('course', 'A course is required').not().isEmpty()
]], async (req, res) => {
    /* ********TODO******** */
    // Test this route
    /* ********TODO******** */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { name, course, description, max_members, id } = req.body;
    const groupFields = {};

    if (name) groupFields.name = name;
    if (course) groupFields.course = course;
    if (description) groupFields.description = description;
    if (max_members) groupFields.max_members = max_members;

    groupFields.members = [];
    groupFields.members.push({
        user: req.user.id,
        host: true
    });

    try {
        if (id) {
            let group = await Group.findByIdAndUpdate(
                id,
                {
                    $set: groupFields
                },
                {
                    new: true
                }
            );

            return res.json(group);
        }

        const newGroup = new Group(groupFields);
        const group = await newGroup.save();

        res.json(group);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route  GET api/groups
// @desc   Get all groups
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        /* ********TODO******** */
        // Test this route
        /* ********TODO******** */
        const groups = await Post.find().sort({ date: -1 });
        res.json(groups);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  GET api/groups/:id
// @desc   Get group by id
// @access Private
router.get(':/id', auth, async (req, res) => {
    try {
        /* ********TODO******** */
        // Test this route
        /* ********TODO******** */
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ msg: 'Group not found'});
        }

        res.json(group);

    } catch (err) { 
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Group not found'});
        }
        res.status(500).send('Server error');
    }
});

// @route  GET api/groups/groupsByCourse
// @desc   Get all the groups in the courses that the user is in
// @access Private
// @note   O(N^2) algorithm should be optimized if app becomes used
router.get('/groupsByCourse', auth, async (req, res) => {
    try {

        const groups = [];
        let groupQuery;

        const profile = await Profile.findOne({ user: req.user.id });

        profile.courses.forEach(course => {

            groupQuery = await Group.find({ course: course });
            groupQuery.forEach(groupQ => {
                groups.push(groupQ);
            });

        });

        res.json(groups);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  GET api/groups/groupMembers/:id
// @desc   Get all group members
// @access Private
router.get('/groupMembers/:id', auth, async (req, res) => {
    try {

        const group = Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ msg: 'Group not found'});
        }

        res.json(group.members);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Group not found'});
        }
        res.status(500).send('Server error');
    }
});

// @route  DELETE api/groups/:id
// @desc   Delete a group
// @access Private
router.delete('/:id', auth, async (req, res) => {

    try { 
        /* ********TODO******** */
        // Test this route
        /* ********TODO******** */
        const group = await Group.findById(req.params.id);
        
        // If group doesn't exist
        if (!group) {
            return res.status(404).json({ msg: 'Group not found'})
        }
ß
        /* ********TODO******** */
        // Test to make sure only hosts can delete groups
        /* ********TODO******** */
        // Make sure the user is a host
        let user = group.members.filter(member => member.user.toString() === req.user.id);
        if (!user) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (user.host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        }

        await group.remove();

        res.json({ msg: 'Group removed' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Group not found'});
        }
        res.status(500).send('Server error');
    }

});

// @route  POST api/groups/posts/:group
// @desc   Add a stickied post
// @access Private
router.post('/posts/:group', [auth,
    check('userid', 'User ID is required').not().isEmpty(),
    check('post', 'Post is required').not().isEmpty()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { userid, post } = req.body;

    try {
        /* ********TODO******** */
        // Test this route
        /* ********TODO******** */
        const user = await User.findById(userid).select('-password');
        const group = await Group.findById(req.params.group);

        if (!user || !group) {
            return res.status(401).json({ msg: 'Group or user not found' });
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser.host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        }

        const newPost = {
            user: userid,
            name: user.name,
            post: post
        }

        group.stickied_posts.unshift(newPost);

        await group.save(); 

        res.json(group.stickied_posts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

// @route  DELETE api/groups/posts/:group/:post_id
// @desc   Delete a stickied post
// @access Private
router.delete('/posts/:group/:post_id', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ msg: 'Group not found'});
        }

        // Pull out post
        const post = group.sticked_posts.find(post => post.id === req.params.post_id);

        // Make sure post exists
        if (!post) {
            return res.status(404).json({ msg: 'Post does not exist'});
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser.host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        }

        const removeIndex = group.stickied_posts.map(post => post.id).indexOf(req.params.post_id);

        group.stickied_posts.splice(removeIndex, 1);

        await group.save();

        res.json(group.stickied_posts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  PUT api/groups/addmember/:group_id/:profile_id
// @desc   Add a member to the group
// @access Private
router.put('/members/:group_id/:profile_id', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.group_id);

        if (!group) {
            return res.status(404).json({ msg: 'Group not found'});
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser.host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        }

        const user = await Profile.findById(req.params.profile_id).user;

        if (!user) {
            return res.status(404).json({ msg: 'User not found'});
        }

        group.members.unshift({
            user: user,
            host: false
        });

        await group.save();

        res.json(group.members);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  PUT api/groups/delmember/:group_id/:profile_id
// @desc   Remove a member from the group
// @access Private
router.put('/delmember/:group_id/:profile_id', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.group_id);

        if (!group) {
            return res.status(404).json({ msg: 'Group not found'});
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser.host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        }

        // Get user ID, check if user exists
        const user = await Profile.findById(req.params.profile_id).user;
        if (!user) {
            return res.status(404).json({ msg: 'User not found'});
        }

        // Find index of the member in the group then remove
        const removeIndex = group.members.map(member => member.user).indexOf(user);
        group.members.splice(removeIndex, 1);

        await group.save();

        res.json(group.members);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  PUT api/groups/hostpriv/:group_id/:user_id
// @desc   Change the priviledge of a member (member -> host || host -> member)
// @access Private
router.put('/hostpriv/:group_id/:profile_id', auth, async (req, res) => {

    try {
        // Get group, check if group exists
        const group = await Group.findById(req.params.group_id);
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        // Get user ID, check if user exists
        const user = await Profile.findById(req.params.profile_id).user;
        if (!user) {
            return res.status(404).json({ msg: 'User not found'});
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser.host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        }

        // Get that member instance and swap the boolean
        // Don't let the founding host unhost themself through APi Requests, would cause the group
        // to forever exist and be mishandled. #TacklingEdgeCasesSinceDayOne
        const memberIndex = group.members.map(member => member.user.toString()).indexOf(user);
        if (memberIndex !== 0) {
            group.members[memberIndex].host = !group.members[memberIndex].host;
        } else {
            return res.status(401).json({ msg: 'Founding host cannot unhost themself' });
        }

        // Save & Return
        await group.save();
        res.json(group.members);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});