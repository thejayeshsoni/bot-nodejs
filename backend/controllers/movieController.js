const Movies = require("../models/moviesCollection");

exports.addNewMovie = async (req, res) => {
    try {
        const { title, synopsis, genre } = req.body;

        if (!title || !synopsis || !genre) {
            return res.status(400).json({ message: "All fields are necessary to add new Movie..!!" });
        }

        const existingMovie = await Movies.findOne({ title: title }).exec();
        if (existingMovie) {
            return res.status(400).json({ message: "Movie already exists.." });
        }

        const newMovie = await Movies.create({ title, synopsis, genre });

        return res.status(200).json({ message: "Movie created into DB successfully..", newMovie });

    } catch (error) {
        res.status(400).json({ message: "Error in creating new movie in DB...!!", error });
    }
};

exports.showAllMovies = async (req, res) => {
    try {
        const movies = await Movies.find({});
        if (!movies) {
            res.status(400).json({ message: "No movies Found...!!" });
        }
        res.status(200).json({ movies });
    } catch (error) {
        res.status(400).json({ message: "Error in fetching movies from DB...!!", error });
    }
};

exports.getMovieByName = async (req, res) => {
    try {
        const { title } = req.body;
        const movie = await Movies.findOne({ title });
        if (!movie) {
            res.status(400).json({ message: "No movie found with given name in DB...!!" });
        }
        res.status(200).json({ message: "Movie found success..!!", movie });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error in fetching movie from DB...!!", error });
    }
};

exports.getMovieByID = async (req, res) => {
    try {
        const { movieId } = req.body;
        const movie = await Movies.findOne({ _id: movieId });
        if (!movie) {
            return res.status(200).json({ message: "No movie found with given id in DB...!!" });
        }
        return res.status(200).json({ message: "Movie found success..!!", movie });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error in fetching movie from DB...!!", error });
    }
};