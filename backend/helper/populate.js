const path = require("node:path");
const dotenv = require("dotenv");
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

const DB_URL = process.env.DB_URL;

const connectDB = require("../DB/dbConfig");
// const Users = require("./models/usersCollection");
// const Movies = require("./models/moviesCollection");
// const Theatres = require("./models/theatresCollection");
const ShowTime = require("../models/showTimesCollection");
// const Bookings = require("./models/bookingsCollection");

// const usersJSON = require("./users.json");
// const moviesJSON = require("./movies.json");
// const theatresJSON = require("./theatres.json");
const showTimeJSON = require("./showTimes.json");
// const bookingsJSON = require("./bookings.json");

const start = async () => {
    try {
        await connectDB(DB_URL)
        // await Users.deleteMany()
        // await Users.create(usersJSON)
        // await Movies.deleteMany()
        // await Movies.create(moviesJSON)
        // await Theatres.deleteMany()
        // await Theatres.create(theatresJSON);
        await ShowTime.deleteMany();
        await ShowTime.create(showTimeJSON);
        // await Bookings.deleteMany();
        // await Bookings.create(bookingsJSON);
        console.log('Success!!!!')
        // const objectId = await Users.find({});
        // console.log(objectId)
        // const results = objectId.map(user => user._id);
        // console.log(results)
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()