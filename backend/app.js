require("dotenv").config();
const express = require("express");
const cloudinary = require("cloudinary");

const app = express();

app.use(express.json());

const { initializeLogger } = require('./utils/logger');

const logger = initializeLogger();

const movies = require("./routes/movieRoutes");
const theatres = require("./routes/theatreRoutes");
const booking = require("./routes/bookingRoutes");
const users = require("./routes/userRoutes");
const shows = require("./routes/showTimingRoutes");

app.use("/movie", movies);
app.use("/theatre", theatres);
app.use("/booking", booking);
app.use("/user", users);
app.use("/shows", shows);

const { DB_URL, PORT } = process.env;

const connectDB = require("./DB/dbConfig");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


app.listen(PORT, async () => {
    await connectDB(DB_URL);
    // logger.info("Server is running on 3000");
    console.log("Server is running on 3000");
})

// module.exports = app;