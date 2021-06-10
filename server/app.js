// Imports
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const PORT = process.env.PORT || 7000;
/////added varaibles
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')


//// added 
app.use("/images", express.static(path.join(__dirname, "public/images")));
// API
const users = require('./api/users');
const books = require('./api/books');

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//added app
app.use(helmet());
app.use(morgan('common'));

// Initialize Passport and use config file
app.use(passport.initialize());
require('./config/passport')(passport);

//storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});



// Home route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Smile, you are being watched by the Backend Engineering Team' });
});

// Routes
app.use('/api/users', users);
app.use('/api/books', books);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);




app.get('/*', (req, res) => {
    res.status(404).json({ message: 'Data not found' });
});

app.listen(PORT, () => {
    console.log(`Server is listening 🎧 on port: ${PORT}`);
});