var mongoose = require('mongoose');


var ProfileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    bio: String,
    last_online: [Date],
    groups: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'group'
    },
    buddies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    courses: [String],
    year: Number
})

var Profile = mongoose.model('profile', ProfileSchema);

module.exports = Profile;