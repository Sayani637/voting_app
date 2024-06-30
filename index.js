const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const db = require('./db');
require('dotenv').config();
// const passport = require('./auth');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// const upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage })

app.set("view engine", "ejs")
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({ extended: false }));

app.get('/',(req,res)=>{
    return res.render('homepage')
});

// File upload api
// app.post('/upload', upload.single('avatar'), (req, res)=>{
//     console.log('File uploaded:', req.body);
//     console.log('File uploaded:', req.file);
//     return res.redirect('/');
// });

// Multiple File upload api
app.post('/upload', upload.fields([ { name: 'avatar' }, { name: 'avatar1' }]), (req, res)=>{
    console.log('Files uploaded:', req.body);
    console.log('Files uploaded:', req.files);
    return res.redirect('/');
});

const sendMail = require('./controllers/sendMail');
app.get('/mail', sendMail);

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