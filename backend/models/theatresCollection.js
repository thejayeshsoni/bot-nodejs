const mongoose = require("mongoose");
const { Schema } = mongoose;

const theatreSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    pricePerSeat: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    seatsAvailable: { type: Number, required: true },
}, { timestamps: true });

theatreSchema.methods.getTheatreId = function () {
    return this._id;
}

module.exports = mongoose.model("Theatre", theatreSchema);