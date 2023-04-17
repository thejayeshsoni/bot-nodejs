const Shows = require("../models/showTimesCollection");
const Movie = require("../models/moviesCollection");
const Theatre = require("../models/theatresCollection");

exports.getAllShows = async (req, res) => {
    try {
        const allShows = await Shows.find({});
        if (!allShows) {
            res.status(400).json({ message: "No shows Found...!!" });
        }
        res.status(200).json({ allShows });
    } catch (error) {
        res.status(400).json({ message: "Error in fetching shows from DB...!!", error });
    }
};

exports.getShow = async (req, res) => {
    try {
        const { showId } = req.body;
        const show = await Shows.findById({ _id: showId }).populate("movieId", "title").populate("theatreId", "name location");
        if (!show) {
            res.status(400).json({ message: "No show Found...!!" });
        }
        res.status(200).json({ message: "show Found...!!", show });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error in fetching show from DB...!!", error });
    }
};

exports.getShowTimeByMovieAndTheatre = async (req, res) => {
    try {
        const { title, name } = req.body;
        const movie = await Movie.findOne({ title });
        const theatre = await Theatre.findOne({ name });
        const show = await Shows.findOne({ movieId: movie._id, theatreId: theatre._id }).populate("movieId", "title").populate("theatreId", "name");
        console.log(show);
        res.status(200).json({ show });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error in fetching show from DB...!!", error });
    }
};