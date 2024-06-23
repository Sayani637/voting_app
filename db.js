const mongoose = require('mongoose');
require('dotenv').config();

// Define the MongoDB connection URL
// const mongoURL = 'mongodb://127.0.0.1:27017/hotels' //Replace 'mydatabase' with your database name
// const mongoURL = 'mongodb+srv://mydb:12345@cluster0.we1c2zu.mongodb.net/'
const mongoURL = process.env.MONGODB_URL_LOCAL;    
// const mongoURL = process.env.MONGODB_URL;

// Set up MongoDB Connection
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Get the default connection
// Mongoose maintains a default connection object representing the mongoDB connection
const db = mongoose.connection;

// Define event listeners for database connection
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Export the database connection
module.exports = db;
