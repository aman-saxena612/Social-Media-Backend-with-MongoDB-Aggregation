const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require('./routes/user');
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const cors = require('cors');
const rateLimitMiddleware = require('./middlewares/rateLimitMiddleware');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const connectDB = require("./db/conn");

const port = process.env.PORT;
connectDB();


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rateLimitMiddleware);

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/posts', rateLimitMiddleware, postRoutes);


const server=app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`);
})

module.exports = app;