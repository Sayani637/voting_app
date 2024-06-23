const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
// const passport = require('./auth');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// const {jwtAuthMiddleware} = require('./jwt');

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidatesRoutes = require('./routes/candidatesRoutes');

// Use the Routers
app.use('/user', userRoutes);
app.use('/candidate', candidatesRoutes);

app.listen(PORT, ()=>{
    console.log('Listening on port 3000');
})