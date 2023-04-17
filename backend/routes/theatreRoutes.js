const router = require("express").Router();

const { showAllTheatres, addNewTheatre, getTheatreByName, getTheatreByID } = require("../controllers/theatreController");

router.route("/list").get(showAllTheatres);
router.route("/add").post(addNewTheatre);
router.route("/theatreName").post(getTheatreByName);
router.route("/theatreId").post(getTheatreByID);

module.exports = router;