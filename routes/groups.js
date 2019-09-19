const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../middleware/auth');

const Group = require('../models/Group');
const Event = require('../models/Event');
const Profile = require('../models/Profile');
const User = require('../models/User');

const pushNotification = require('../utils/notification');
const sendLivePush = require('../app');

/*
    Tried my best to think critically and maximize the APi design to be practical,
    and for the flow to be defended if people were interfacing the APi directly
    themselves. For example, a member can only join a group if the member actually
    wants too. The host can't force a member to join by using the APi, I did
    this through the 'request' endpoint, which depends on the Auth middleware.
    Which was a little complicated as there are public/private groups, ways to
    join groups through join links, and join requests. Feedback is well welcomed.
*/

/*
    When I was a game programmer, I was a lot better at writing functions to
    reuse code and increase modularity. My lack of this here is a huge flaw. 
    The fear of modular functions in APis was developed when I was new to node
    and not fully familiar with asynchronous actions, and I had some problems.
    For those judging my code, hopefully this doesn't leave a bad impression.
    I'm workin on it lol. At least I recognize it? :P
    I'll probably break it up one day, I'd just have to retest everything,
    and as you can tell, theres a lot of testing/cases for these many endpoints.
*/

/*
    Architecture Notes to self:
        - Never use unshift to add new members, member[0] (undeletable) is kept
          as the origin host. Can only push to [members] in Group model.
        - => If private, members can only be added if they're in the 'requests' array,
          => If public, still use 'request' endpoint to add members, it will bypass and auto-add
          => Hosts can invite members bypassing 'request' block by requesting to 'invite' endpoint,
          => Public or Private, users can join if groupid in their invites array in Profile model
          => Non-host members can request invites by using message-notification service, sending
             Profiles ID to hosts. Maybe add an invite-only priveledge, would require some changes.
        - Should probably further advance validation across all routes.
*/

// @route  POST api/groups
// @desc   Create or update a group
// @access Private
router.post('/', [auth, [
    check('name', 'Name is required').not().isEmpty(),
    check('course', 'A course is required').not().isEmpty(),
    check('name', 'Name exceeded character limit of 50').custom(value =>
        value.length <= 50),
    check('description', 'Description exceeded character limit of 150').custom(value =>
        value.length <= 150),
    check('max_members', 'Exceeded maximum of 500 members').custom(value =>
        parseInt(value) <= 500),
    check('max_members', 'Minimum 2 members required').custom(value =>
        parseInt(value) >= 2)
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errorMsgs = errors.array().map(err => err.msg);
        return res.status(400).json({
            msg: errorMsgs
        });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
        return res.status(404).json({ msg: 'Profile has not been created yet'});
    }

    const { name, course, description, max_members, public, id } = req.body;

    /* CHECK IF A GROUP UPDATE IS DONE BY A HOST */
    if (id) {
        const group = await Group.findById(id);
        if (group) {
            let memberIndex = group.members.filter(member => member.user.toString() === req.user.id.toString());
            if (memberIndex.length > 0) {
                if (memberIndex[0].host === false) {
                    return res.status(401).json({ msg: 'You are not a host of this group' });
                }
            } else {
                return res.status(401).json({ msg: 'You are not a member of this group' });
            }
        }
    }
    /* CHECK IF A GROUP UPDATE IS DONE BY A HOST */

    const groupFields = {};
    if (name) groupFields.name = name;
    if (course) groupFields.course = course;
    if (description) groupFields.description = description;
    if (max_members) groupFields.max_members = max_members;
    if (public) groupFields.public = public;

    if (!id) {
        groupFields.members = [];
        groupFields.members.push({
            user: req.user.id,
            host: true
        });
    }

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
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().sort({ date_created: -1 });
        res.json(groups);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET api/groups/byCourse
// @route  Get all the groups by the user's course list
// @access Private
router.get('/byCourse', auth, async (req, res) => {
    /* ********TODO******** */
    // Test this route when well database is well populated
    /* ********TODO******** */
    try {
        /* Get the profile and check if it exists */
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not created yet'});
        }

        /* Query groups by the courses the user is in */
        const { courses } = profile;
        const groups = await Group.find({ course: { $in: courses }});

        /* Send back the query */
        res.json(groups);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  GET api/groups/byCourse/:id
// @desc   Get all groups of a certain course
// @access Private
router.get('/byCourse/:course', auth, async (req, res) => {
    try {
        let groups = await Group.find({course: req.params.course});

        if (!groups) {
            res.status(404).json({ msg: `unfortunately there are no study groups for ${req.params.course} as of now`});
        }

        res.json(groups);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  GET api/groups/:id
// @desc   Get group by id
// @access Private
router.get('/:id', async (req, res) => {
    try {
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

// @route  GET api/groups/events/:group_id
// @desc   Get the events under this group
// @access Public
router.get('/events/:group_id', auth, async (req, res) => {
    try {
        /* Get the group and check if it exists */
        const group = await Group.findById(req.params.group_id);
        if (!group) {
            return res.status(404).json({ msg: 'Group not found'});
        }

        /* Get the events of the group and send */
        const events = await Event.find({ group: req.params.group_id });
        
        res.json(events);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  DELETE api/groups/:id
// @desc   Delete a group
// @access Private
router.delete('/:id', auth, async (req, res) => {

    try {   
        const group = await Group.findById(req.params.id);
        
        // If group doesn't exist
        if (!group) {
            return res.status(404).json({ msg: 'Group not found'})
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser[0]) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser[0].host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        } 

        /* Find and remove all the events under this group, and the group */
        await Event.deleteMany({ group: req.params.id });
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

// @route GET api/groups/memberProfiles/:group_id
// @desc  Get all the profiles of members of a group
// @access Private
router.get('/memberProfiles/:group_id', auth, async (req, res) => {
    try {
        /* get the group */
        const group = await Group.findById(req.params.group_id);
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        /* check if the user is a member of the group */
        const memberIndex = group.members.map(member => member.user.toString()).indexOf(req.user.id.toString());
        if (memberIndex < 0) {
            return res.status(401).json({ msg: 'You are not a member of this group' });
        }

        /* get the profiles */
        const profiles = await Profile.find({ user: { $in: group.members.map(member => member.user) }}).populate('user', ['name', 'avatar', '_id']);
        res.json(profiles);

    } catch (err) {
        console.error(err.message);
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
        const user = await User.findById(userid).select('-password');
        const group = await Group.findById(req.params.group);

        if (!user || !group) {
            return res.status(401).json({ msg: 'Group or user not found' });
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser[0]) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser[0].host === false) {
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

// @route  DELETE api/groups/posts/:group_id/:post_id
// @desc   Delete a stickied post
// @access Private
router.delete('/posts/:group_id/:post_id', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.group_id);

        if (!group) {
            return res.status(404).json({ msg: 'Group not found'});
        }
        // Pull out post
        const removeIndex = group.stickied_posts.map(post => post.id).indexOf(req.params.post_id);
        
        // Make sure post exists
        if (removeIndex < 0) {
            return res.status(404).json({ msg: 'Post does not exist'});
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser[0]) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser[0].host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        }

        group.stickied_posts.splice(removeIndex, 1);

        await group.save();

        res.json(group.stickied_posts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  PUT api/groups/requests/:group_id
// @desc   Add a member request 
// @access Private
router.put('/requests/:group_id', auth, async (req, res) => {
    try {
        // Check if the profile exists (User shouldn't be sending requests without a profile)
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(401).json({ msg: 'Make a profile before joining groups'});
        }
        const user = await User.findById(req.user.id);

        // Get the group and check if it exists
        const group = await Group.findById(req.params.group_id);
        if (!group) {
            return res.status(404).json({ msg: 'Group does not exist'});
        }

        /* Make sure the user isn't already in the group */
        let joiningUser = group.members.filter(member => member.user.toString() === req.user.id.toString());
        if (joiningUser.length > 0) {
            return res.status(401).json({ msg: 'Member already joined'});
        }

        /* Check if the group has a set max_member count, and validate */
        if (group.max_members) {
            if (group.members.length === group.max_members) {
                return res.status(400).json({ msg: 'Group\'s max member count as been reached' });
            }
        }

        // Check if the group is public, if so, just autojoin
        if (group.public === true) {
            group.members.push({ user: req.user.id, host: false });
            await group.save();
            return res.json({ msg: `${user.name} joined ${group.name}` });
        }

        /* Check if the user has a pending invite, let them in */
        let inviteIndex = profile.invites.map(invite => invite.toString()).indexOf(req.params.group_id);
        if (inviteIndex > -1) {
            profile.invites.splice(inviteIndex, 1);
            group.members.push({ user: req.user.id, host: false });
            await profile.save();
            await group.save();
            return res.json({ msg: 'An invite was already sent to you, so we\'ll let you into the group' });
        }

        /* Check if they already sent a request */
        let existingRequest = group.requests.filter(request => request.toString() === req.user.id.toString());
        if (existingRequest.length > 0) {
            return res.status(400).json({ msg: 'You have already sent a request to join this group'});
        }

        // Add the member request and save
        group.requests.unshift(req.user.id);
        await group.save();
        res.json({ msg: `Request sent to ${group.name}`});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  DELETE api/groups/requests/:group_id/:user_id
// @desc   Resolve a group request
// @access Private
router.delete('/requests/:group_id/:user_id', auth, async (req, res) => {
    try {

        /* Check if user exists */
        const user = await User.findById(req.params.user_id);
        if (!user) {
            return res.status(404).json({ msg: 'User does not exist' });
        }

        /* Get group, check if group exists */
        const group = await Group.findById(req.params.group_id);
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser.host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        }

        /* Get the index of the user and check if it was requested */
        const removeIndex = group.requests.map(member => member.toString()).indexOf(req.params.user_id);
        if (removeIndex < 0) {
            return res.status(400).json({ msg: 'User did not send a join request'});
        }

        /* Remove the user, save, and return */
        group.requests.splice(removeIndex, 1);
        await group.save();
        res.json({ msg: `${user.name} resolved from join requests`});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  PUT api/groups/invite/:group_id/:profile_id
// @desc   Send an invite to a profile
// @access Private
router.put('/invite/:group_id/:profile_id', auth, async (req, res) => {
    try {
        /* Check if user exists */
        const profile = await Profile.findById(req.params.profile_id);
        if (!profile) {
            return res.status(404).json({ msg: 'Profile does not exist' });
        }
        const user = await User.findById(profile.user);

        /* Get group, check if group exists */
        const group = await Group.findById(req.params.group_id);
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser.host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        }

        /* Make sure the user isn't already in the group */
        let joiningUser = group.members.filter(member => member.user.toString() === profile.user.toString());
        if (joiningUser.length > 0) {
            return res.status(400).json({ msg: 'Member is already in the group'});
        }

        /* Check if the group has a set max_member count, and validate */
        if (group.max_members) {
            if (group.members.length === group.max_members) {
                return res.status(400).json({ msg: 'Group\'s max member count as been reached' });
            }
        }

        /* Check if an invite was already sent */
        let existingInvite = profile.invites.filter(invite => invite.toString() === req.params.group_id);
        if (existingInvite.length > 0) {
            return res.status(400).json({ msg: 'This user already has a pending invite for this group'});
        }
        
        /* Check if they sent a request to join the group, just let them in */
        let requestIndex = group.requests.map(request => request.toString()).indexOf(profile.user.toString());
        if (requestIndex > -1) {
            group.requests.splice(requestIndex, 1);
            group.members.push({ user: user.id, host: false });
            await group.save();
            return res.json({ msg: `${user.name} sent a request already so ${user.name} has been added to the group`});
        }

        /* Send the invite */
        profile.invites.unshift(req.params.group_id);
        await profile.save();

        await pushNotification({
            message: `You have been invited to join ${group.name}`,
            group: group._id
        }, profile._id);

        sendLivePush(`${profile.user.toString()}`, `You have been invited to ${group.name}`);

        res.json({ msg: `Invite was sent to ${user.name}`});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  PUT api/groups/members/:group_id/:user_id
// @desc   Add a member to the group
// @access Private
router.put('/members/:group_id/:user_id', auth, async (req, res) => {
    try {

        /* Fetch the group and member to add to the group */
        const group = await Group.findById(req.params.group_id);
        const joiningProfile = await Profile.findOne({ user: req.params.user_id });
        let user = joiningProfile.user;

        /* Check if the retrievals were successful */
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }
        if (!joiningProfile) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (!user) {
            return res.status(404).json({ msg: 'Profile Error, cannot retrieve user' });
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser[0]) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser[0].host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        }

        /* Make sure the user isn't already in the group */
        let joiningUser = group.members.filter(member => member.user.toString() === user.toString());
        if (joiningUser.length > 0) {
            return res.status(400).json({ msg: 'Member already joined'});
        }

        /* Check if the group has a set max_member count, and validate */
        if (group.max_members) {
            if (group.members.length === group.max_members) {
                return res.status(400).json({ msg: 'Group\'s max member count as been reached' });
            }
        }

        /* Make sure the user actually asked to join in the first place */
        let requestIndex = group.requests.map(member => member.toString()).indexOf(user);
        if (requestIndex < 0) {
            return res.status(400).json({ msg: 'User did not request to join the group' });
        }

        /* send a push notification */
        sendLivePush(`${joiningProfile.user.toString()}`, `You have been accepted into ${group.name}`)

        /* Add the new member, resolve the request, save & return */
        group.members.push({ user: user, host: false });
        group.requests.splice(requestIndex, 1);
        await group.save();
        res.json(group.members);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  DELETE api/groups/members/:group_id/:profile_id
// @desc   Remove a member from the group
// @access Private
router.delete('/members/:group_id/:user_id', auth, async (req, res) => {
    try {
        /* Fetch the group and member to add to the group */
        const group = await Group.findById(req.params.group_id);
        const leavingProfile = await Profile.findOne({ user: req.params.user_id });
        let user = leavingProfile.user;

        /* Check if the retrievals were successful */
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }
        if (!leavingProfile) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (!user) {
            return res.status(404).json({ msg: 'Profile Error, cannot retrieve user' });
        }

        /* Make sure the user that sent the request is a host */
        let requestingUser = group.members.filter(member => member.user.toString() === req.user.id);
        if (!requestingUser[0]) {
            return res.status(400).json({ msg: 'User is not a member of this group'});
        }
        if (requestingUser[0].host === false) {
            return res.status(401).json({ msg: 'You are not a host'});
        }

        /* Make sure the user is already in the group */
        const removeIndex = group.members.map(member => member.user.toString()).indexOf(user);
        if (removeIndex < 0) {
            return res.status(401).json({ msg: 'Member is not in the group'});
        }

        /* Remove the member, save & return */
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
        const profile = await Profile.findById(req.params.profile_id);
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found'});
        }
        const { user } = profile;

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

module.exports = router;