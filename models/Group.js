var mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        privilege: Number
    }],
    stickied_posts: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        post: String,
        time_stamp: Date
    }],
    max_members: Number,
    description: String,
    course: String,
    date_created: {
        type: Date,
        default: Date.now
    }
})

var Group = mongoose.model('group', GroupSchema);

module.exports = Group;