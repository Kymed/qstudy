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
    max_members: Number,
    description: String,
    public: {
        type: Boolean,
        default: false
    },
    requests: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        host: {
            type: Boolean,
            default: false
        }
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
    date_created: {
        type: Date,
        default: Date.now()
    }
})

var Group = mongoose.model('group', GroupSchema);

module.exports = Group;