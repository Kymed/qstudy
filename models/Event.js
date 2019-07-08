var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    course: {
        type: String,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',
        required: true
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    date: {
        type: Date,
        required: true
    }
})

var Event = mongoose.model('event', EventSchema);

module.exports = Event;