var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    course: String,
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',
        required: true
    },
    location: {
        lat: Number,
        lng: Number,
        required: true
    },
    time: Date
})

var Event = mongoose.model('event', EventSchema);

module.exports = Event;