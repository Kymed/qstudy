const express = require('express');
const connectDB = require('./config/db');

const app = express();

/*
    This was a large APi and one of my first fully completed things.
    You'll notice lots of eh code, lots of better code.
    As I was working on it, I increasingly got better at this.
    I could of turn a lot of repeated code into some of those 'utils' functions.
    I refactored what was most necessary (a big difference).
    Lots of opportunities I could of made my own middleware like for verifying
    if the requesting user of endpoints involving group changes was a host of that
    group. Doesn't make a big difference though, just better practice. Next time.
    Lots of endpoints, lots of test cases (using postman), lots of fun.
    -  Kymed
*/

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
app.use('/api/groups', require('./routes/groups'));
app.use('/api/events', require('./routes/events'));

// start api
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));

/*
    TODO: Add messages to be sent for notifications (with options to add links to groups/events)
*/

/* NAVS

GUEST - REGISTER LOGIN
USER - EXPLORE PEERS GROUPS DASHBOARD LOGOUT
>DASHBOARD - PROFILEINFO EDITPROFILE MYGROUPS NOTIFICATIONS FRIENDSLIST (>CREATEGROUP)
>NOTIFICATIONS - Friend Requests, Group invites, Group requests, Messages
>PEERS - PEOPLE ONLINE IN YOUR CLASSES
>EXPLORE - GOOGLE MAPS OF UPCOMING SESSIONS IN YOUR CLASSES 
>GROUPS - GROUPS PEOPLE MADE OF YOUR CLASSES (>CREATEGROUP)
>CREATEGROUP - FORM
>CREATEEVENT - MAP & FORM
>GROUP - JOINREQUESTS MEMBERS EVENTS GROUPCHAT STICKIED JOIN_LINK (EXTRA FEATURES IF HOST)
>PEER - GROUPS CLASSES BIO YEAR ADD_OPTION INVITE_GROUP
>INSTANTINVITE

*/

/* REASONS

 1. Facebook study groups have trouble marketing themselves those enrolling in the classes
 2. Not everyone has facebook
 3. Some people are taking courses out of their degree and may not have friends in such class
 4. Some people don't go to such class and don't make friends in such lectures
 5. Some people like real-life group study sessions but don't know many in the class
 6. People like to help eachother, ask questions, and get answered
 7. Facebook is not intuitive for the use-cases of an education based social media
 8. It's like Linkedin for people studying

*/