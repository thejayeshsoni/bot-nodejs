const axios = require("axios");

const getAllMoviesList = async () => {
    let movieList = await axios.get("http://localhost:3000/movie/list");
    // console.log(movieList.data);
    return movieList.data;
};

const getAllTheatresList = async () => {
    let theatreList = await axios.get("http://localhost:3000/theatre/list");
    // console.log(theatreList.data);
    return theatreList.data;
};

const getMovie = async (movieName) => {
    const movie = await axios.post("http://localhost:3000/movie/movieName", { title: movieName });
    return movie.data;
};

const getTheatre = async (theatreName) => {
    const theatre = await axios.post("http://localhost:3000/theatre/theatreName", { name: theatreName });
    return theatre.data;
};

const getShow = async (movieName, theatreName) => {
    const show = await axios.post("http://localhost:3000/shows/sh", { title: movieName, name: theatreName });
    return show.data;
};

const getUser = async (userEmail) => {
    const user = await axios.post("http://localhost:3000/user/customer", { email: userEmail });
    return user.data;
}

const bookMovieTicket = async (movieId, theatreId, showTimeId, userId, seatsBooked) => {
    const booking = await axios.post("http://localhost:3000/booking/bookTicket", {
        movieId, theatreId, showTimeId, userId, seatsBooked
    });
    return booking.data;
}

const getBookingDetails = async (bookingId) => {
    const booking = await axios.post("http://localhost:3000/booking/list", { bookingId });
    return booking.data;
};

const getBookingDetailsByEmail = async (email) => {
    const booking = await axios.post("http://localhost:3000/booking/bookingDetails", { email });
    return booking.data;
}

const getMovieByID = async (movieId) => {
    const movie = await axios.post("http://localhost:3000/movie/movieId", { movieId });
    return movie.data;
}
const getTheatreByID = async (theatreId) => {
    const theatre = await axios.post("http://localhost:3000/theatre/theatreId", { theatreId });
    return theatre.data;
};

const deleteBooking = async (bookingId) => {
    const deletedBooking = await axios.delete("http://localhost:3000/booking/deleteBooking", {
        data: {
            bookingId
        }
    });
    return deletedBooking.data;
}

const sendBookingConfirmationMail = async (email, movieTitle, theatreName, seatsBooked, totalPrice) => {
    const sendMail = await axios.post("http://localhost:3000/booking/mail", {
        email, movieTitle, theatreName, seatsBooked, totalPrice
    });
    return sendMail.data;
}

module.exports = {
    getAllMoviesList,
    getAllTheatresList,
    getMovie,
    getTheatre,
    getShow,
    getUser,
    bookMovieTicket,
    getBookingDetails,
    getBookingDetailsByEmail,
    getMovieByID,
    getTheatreByID,
    deleteBooking,
    sendBookingConfirmationMail
}
