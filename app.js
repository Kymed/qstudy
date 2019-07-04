const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connect database
connectDB();

// init middleware
app.use(express.json({
    extended: false
}));

// test route
app.get('/', (req, res) => {
    res.send('api working');
});

// define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));

// start api
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));

/* NAVS

GUEST - REGISTER LOGIN
USER - EXPLORE PEERS GROUPS DASHBOARD LOGOUT
>DASHBOARD - PROFILEINFO EDITPROFILE MYGROUPS NOTIFICATIONS FRIENDSLIST (>CREATEGROUP)
>NOTIFICATIONS - Friend Requests, Group requests, Group join requests
>PEERS - PEOPLE ONLINE IN YOUR CLASSES
>EXPLORE - GOOGLE MAPS OF UPCOMING SESSIONS IN YOUR CLASSES 
>GROUPS - GROUPS PEOPLE MADE OF YOUR CLASSES (>CREATEGROUP)
>CREATEGROUP - FORM
>CREATEEVENT - MAP & FORM
>GROUP - JOINREQUESTS MEMBERS EVENTS GROUPCHAT STICKIED JOIN_LINK (EXTRA FEATURES IF HOST)
>PEER - GROUPS CLASSES BIO YEAR ADD_OPTION INVITE_GROUP
>INSTANTINVITE

*/