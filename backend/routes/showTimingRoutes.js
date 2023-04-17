const router = require("express").Router();

const { getAllShows, getShow, getShowTimeByMovieAndTheatre } = require("../controllers/showTimingController");

router.route("/list").get(getAllShows);
router.route("/show").get(getShow);
router.route("/sh").post(getShowTimeByMovieAndTheatre);

module.exports = router;