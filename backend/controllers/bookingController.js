const Booking = require("../models/bookingsCollection");
const Movie = require("../models/moviesCollection");
const Theatre = require("../models/theatresCollection");
const ShowTiming = require("../models/showTimesCollection");
const User = require("../models/usersCollection");

exports.bookNewTicket = async (req, res) => {
  try {
    const { movieId, theatreId, showTimeId, userId, seatsBooked } = req.body;
    if (!movieId || !theatreId || !showTimeId || !userId || !seatsBooked) {
      return res.status(400).json({ message: "All fields are necessary to book new Movie ticket..!!" });
    }

    const theatre = await Theatre.findById(theatreId);

    if (seatsBooked > theatre.seatsAvailable) {
      return res.status(400).json({ message: "No seats available" });
    }

    const newBooking = await Booking.create({
      showTimeId, userId, seatsBooked, totalPrice: seatsBooked * theatre.pricePerSeat
    });
    theatre.seatsAvailable -= seatsBooked;

    await newBooking.save();
    await theatre.save();

    return res.status(200).json({ message: "booking successfull for new Movie ticket..!!", newBooking });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Booking is not successful", error });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      res.status(400).json({ message: "Plz provide a ID" });
    }
    const booking = await Booking.findById(bookingId).populate("userId", "name email").populate("showTimeId", "movieId title theatreId name");
    if (!booking) {
      res.status(400).json({ message: "No booking found" });
    }
    res.status(200).json({ success: true, message: "Booking found successfull", booking });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error in feteching Booking details from DB...!!", error });
  }
};

exports.getBookingDetailsByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required..!" });
    }
    const booking = await Booking.find().populate([{
      path: "userId",
      model: User,
      match: { email },
      select: ["name", "email"]
    }, {
      path: "showTimeId",
      populate: [{
        path: "movieId",
        model: Movie,
        select: ["title"]
      }, {
        path: "theatreId",
        model: Theatre,
        select: ["name", "location"]
      }]
    }]);
    const result = [];
    for (const iterator of booking) {
      if (iterator.userId !== null) {
        result.push(iterator);
      }
    }
    if (result.length === 0) {
      return res.status(200).json({ success: false, message: "No booking found with given mail." });
    }
    res.status(200).json({ success: true, message: "All bookings that are based on your mail found..!!", result, totalBookings: result.length });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Error in fetching booking with this mail.", error });
  }
};

exports.deleteBookingByEmail = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const deletedBooking = await Booking.findByIdAndDelete({ _id: bookingId });
    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      deletedBooking
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error in deleting the booking",
      error
    });
  }
};

// exports.bookNewTicket = async (req, res) => {
//   try {

//     const { movieId, theatreId, showTimeId, customerId, seats } = req.body;

//     // Check if movie exists
//     const movie = await Movie.findById(movieId);
//     if (!movie) {
//       throw new Error('Movie not found');
//     }

//     // Check if theatre exists
//     const theatre = await Theatre.findById(theatreId);
//     if (!theatre) {
//       throw new Error('Theatre not found');
//     }

//     // Check if showtime exists
//     const showtime = await ShowTiming.findById(showTimeId);
//     if (!showtime) {
//       throw new Error('Showtime not found');
//     }

//     // Check if customer exists
//     const customer = await User.findById(customerId);
//     if (!customer) {
//       throw new Error('Customer not found');
//     }

//     // if (!movieId || !theatreId || !showTimeId || !customerId || !seats) {
//     //   return res.status(400).json({ message: "All fields are necessary to book a Movie..!!" });
//     // }

//     const newMovieBooking = new Booking({
//       movieId,
//       showTimeId,
//       userId: customerId,
//       theatreId,
//       seatesBooked: seats,
//       bookingDate: Date.now()
//     });

//     await newMovieBooking.save();

//     // const fullBooking = await Booking.findById(newMovieBooking._id).populate('movie').populate('theatre').populate('showTimings').populate('user').exec();

//     return res.status(200).json({ message: "Movie booking done successfully..", newMovieBooking });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ message: "Movie ticket booking is not successfull", error });
//   }
// };




/*

const Movie = require('../models/moviesCollection');
const Theatre = require('../models/theatresCollection');
const Showtime = require('../models/showTimesCollection');
const Booking = require('../models/bookingsCollection');
const Customer = require('../models/usersCollection');

exports.bookTicket = async (movieId, theatreId, showtimeId, customerId, seats) => {
  try {
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    // Check if theatre exists
    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      throw new Error('Theatre not found');
    }

    // Check if showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      throw new Error('Showtime not found');
    }

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Check if seats are available
    if (seats > theatre.seatsAvailable) {
      throw new Error('Not enough seats available');
    }

    // Create booking
    const booking = new Booking({
      movie: movieId,
      theatre: theatreId,
      showtime: showtimeId,
      customer: customerId,
      seats,
      totalPrice: seats * theatre.pricePerSeat
    });

    // Decrement seats available in theatre
    theatre.seatsAvailable -= seats;

    // Save booking and theatre
    await booking.save();
    await theatre.save();

    return booking;
  } catch (err) {
    throw err;
  }
}

*/