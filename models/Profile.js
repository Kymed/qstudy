var mongoose = require('mongoose');

var NotificationSchema = mongoose.Schema({
    message: String,
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    }
});

var ProfileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    bio: String,
    courses: [String],
    year: Number,
    last_online: Date,
    invites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'group'
    },
    buddies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    requests: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    notifications: [NotificationSchema]
})

var Profile = mongoose.model('profile', ProfileSchema);

module.exports = Profile;