const Theatre = require("../models/theatresCollection");

exports.showAllTheatres = async (req, res) => {
    try {
        const theatres = await Theatre.find({});
        if (!theatres) {
            res.status(400).json({ message: "No Theatres Found...!!" });
        }
        res.status(200).json({ theatres });
    } catch (error) {
        res.status(400).json({ message: "Error in fetching theatres from DB...!!", error });
    }
};


exports.addNewTheatre = async (req, res) => {
    try {
        const { name, location, pricePerSeat, totalSeats, seatsAvailable } = req.body;

        if (!name || !location || !pricePerSeat || !totalSeats || !seatsAvailable) {
            return res.status(400).json({ message: "All fields are necessary to add new Theatre..!!" });
        }

        const existingTheatre = await Theatre.findOne({ name: name }).exec();
        if (existingTheatre) {
            return res.status(400).json({ message: "Theatre already exists.." });
        }

        const newTheatre = await Theatre.create({ name, location, pricePerSeat, totalSeats, seatsAvailable });

        return res.status(200).json({ message: "Theatre created into DB successfully..", newTheatre });

    } catch (error) {
        // console.log(error);
        res.status(400).json({ message: "Error in creating new theatre in DB...!!", error });
    }
};

exports.getTheatreByName = async (req, res) => {
    try {
        const { name } = req.body;
        const theatre = await Theatre.findOne({ name });
        if (!theatre) {
            res.status(400).json({ message: "No theatre found with given name in DB...!!" });
        }
        res.status(200).json({ message: "Theatre found success..!!", theatre });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error in fetching Theatre from DB...!!", error });
    }
};

exports.getTheatreByID = async (req, res) => {
    try {
        const { theatreId } = req.body;
        const theatre = await Theatre.findOne({ _id: theatreId });
        if (!theatre) {
            res.status(400).json({ message: "No theatre found with given id in DB...!!" });
        }
        res.status(200).json({ message: "Theatre found success..!!", theatre });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error in fetching theatre from DB...!!", error });
    }
};