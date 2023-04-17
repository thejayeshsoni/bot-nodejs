const router = require("express").Router();

const { showAllMovies, addNewMovie, getMovieByName, getMovieByID } = require("../controllers/movieController")

router.route("/list").get(showAllMovies);
router.route("/add").post(addNewMovie);
router.route("/movieName").post(getMovieByName);
router.route("/movieId").post(getMovieByID);

module.exports = router;