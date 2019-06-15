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

// start api
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));