const router = require("express").Router();

const { bookNewTicket, getBookingDetails, getBookingDetailsByEmail, deleteBookingByEmail } = require("../controllers/bookingController");
const { sendMail } = require("../utils/mailHelper");

router.route("/bookTicket").post(bookNewTicket);
router.route("/list").post(getBookingDetails);
router.route("/bookingDetails").post(getBookingDetailsByEmail);
router.route("/deleteBooking").delete(deleteBookingByEmail);

router.route("/mail").post(sendMail);

module.exports = router;