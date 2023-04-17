const mongoose = require("mongoose");
const { Schema } = mongoose;

const showTimingsSchema = new Schema({
    movieId: {
        type: Schema.Types.ObjectId,
        ref: "Movie"
    },
    theatreId: {
        type: Schema.Types.ObjectId,
        ref: "Theatre"
    },
    dateTime: {
        type: Date,
        required: true
    },
    availableSeats: {
        type: Number
    },
    pricePerSeat: {
        type: Number
    }
}, { timestamps: true });

showTimingsSchema.methods.getShowTimeId = function () {
    return this._id;
}

module.exports = mongoose.model("ShowTimings", showTimingsSchema);