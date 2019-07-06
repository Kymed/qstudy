var mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        host: Boolean
    }],
    stickied_posts: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        name: String,
        post: String,
        time_stamp: Date
    }],
    max_members: Number,
    description: String,
    date_created: {
        type: Date,
        default: Date.now
    }
})

var Group = mongoose.model('group', GroupSchema);

module.exports = Group;