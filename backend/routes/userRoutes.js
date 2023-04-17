const router = require("express").Router();

const { getAllUsers, addNewUser, getUserByEmail } = require("../controllers/userController")

router.route("/list").get(getAllUsers);
router.route("/add").post(addNewUser);
router.route("/customer").post(getUserByEmail);

module.exports = router;