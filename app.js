const express = require('express');
const connectDB = require('./config/db');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const socketHandlers = require('./sockets/handlers');
const path = require('path');

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

// handle socket server
io.on('connection', (socket) => {
    socket.on('subscribe', (data) => socketHandlers.subscribeToGroup(data, socket));
    socket.on('send_message', (data) => socketHandlers.recieveMessage(data, io));
    socket.on('subscribe_push', (data) => socketHandlers.subscribeToPush(data, socket));
    socket.on('unsubscribe', (data) => socketHandlers.unsubscribeToGroup(data, socket));
    socket.on('unsubscribe_push', (data) => socketHandlers.unsubscribeToPush(data, socket));
});

// export push notification
module.exports = (userid, msg) => {
    io.in(`user-${userid}`).emit('notification', `${msg}`);
}

// define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/events', require('./routes/events'));

// Serve static assets if we're in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// start api
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`Server started on ${PORT}`));