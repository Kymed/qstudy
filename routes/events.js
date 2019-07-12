const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../middleware/auth');

const Group = require('../models/Group');
const Event = require('../models/Event');

const getCity = require('../utils/geocoding');

// @route  POST api/events
// @desc   Create or update an event
// @access Private
router.post('/', [auth, [
    // TODO: See if there are validators for IDs, Lat/Lng, and Dates
    check('title', 'Title is required').not().isEmpty(),
    check('group', 'Group ID is required').not().isEmpty(),
    check('lat', 'Latitude is required').not().isEmpty(),
    check('lng', 'Latitude is required').not().isEmpty(),
    check('date', 'Date & Time is required').not().isEmpty()
]], async (req, res) => {

    // Check if there are errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    // Destructure the post request's body
    const { title, description, group, lat, lng, date, id } = req.body;

    // Check if the group for the event actually exists
    const groupDoc = await Group.findById(group);
    if (!groupDoc) {
        return res.status(404).json({ msg: 'Group is not found or invalid '});
    }

    /* Make sure the latitude & longitude is in Kingston */
    if (lat && lng) {
        let city = await getCity(lat, lng);
        if (city !== "Kingston") {
            return res.status(400).json({ msg: 'You can only make crams in Kingston' });
        }
    } else {
        return res.status(400).json({ msg: 'Latitude & Longitude not included' });
    }

    // Set the fields for the new event
    const eventFields = {};
    if (title) eventFields.title = title;
    if (description) eventFields.description = description;
    if (group) eventFields.group = group;

    eventFields.course = groupDoc.course;
    if (date) { 
        let dateTokens = date.split(',');
        eventFields.date = Date.UTC(dateTokens[0],dateTokens[1],dateTokens[2],dateTokens[3],dateTokens[4],dateTokens[5]);
    }

    eventFields.location = {
        lat,
        lng
    }

    try {
        // If the event already exists, update it
        if (id) {
            let event = await Event.findByIdAndUpdate(id,
                {
                    $set: eventFields
                },
                {
                    new: true
                }
            );

            // Get the group that owns the event
            const group = await Group.findById(event.group);
            if (!group) {
                console.log('There seems to exist an event without a group.');
                return res.status(404).json({ msg: 'Event is bugged, does not have an owning group'});
            }

            // See if the user sending the request is a host of the group which owns the event
            const hosts = group.members.filter(member => member.host === true);
            const hostIndex = hosts.map(host => host.user.toString()).indexOf(req.user.id);
            if (hostIndex < 0) {
                return res.status(401).json({ msg: 'You are not a host of the group that owns this event'});
            }

            return res.json(event);
        }

        // If the event doesn't exist, make the new one
        const newEvent = new Event(eventFields);
        const event = await newEvent.save();

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

// @route  GET api/events
// @desc   Get all events
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  GET api/events/:id
// @desc   Get event by id
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found'});
        }

        res.json(event);

    } catch (err) { 
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Event not found'});
        }
        res.status(500).send('Server error');
    }
});

// @route  GET api/events/new/:course
// @desc   Find upcoming events based on the course
// @access Private
router.get('/new/:course', auth, async (req, res) => {
    try {
        // Delete all events that already happened
        await Event.deleteMany({ date: { $lte: Date.now() }});
        
        // Get all the events in the course
        const events = await Event.find({ course: req.params.course });
        
        // Return the new events
        res.json(events);

    } catch (err) {
        console.error(err.messsage);
        res.status(500).send('Server error');
    }
});

// @route  DELETE api/events/:id
// @desc   Delete a event
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        
        // Get the event
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found'});
        }

        // Get the group that owns the event
        const group = await Group.findById(event.group);
        if (!group) {
            console.log('There seems to exist an event without a group.');
            return res.status(404).json({ msg: 'Event is bugged, does not have an owning group'});
        }

        // See if the user sending the request is a host of the group which owns the event
        const hosts = group.members.filter(member => member.host === true);
        const hostIndex = hosts.map(host => host.user.toString()).indexOf(req.user.id);
        if (hostIndex < 0) {
            return res.status(401).json({ msg: 'You are not a host of the group that owns this event'});
        }

        // Remove the event & return
        await event.remove();
        res.json({ msg: 'Event was removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;