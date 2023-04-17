const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingsSchema = new Schema({
    showTimeId: {
        type: Schema.Types.ObjectId,
        ref: "ShowTimings"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    seatsBooked: {
        type: Number
    },
    totalPrice: {
        type: Number
    }
}, { timestamps: true });

bookingsSchema.methods.getBookingId = function () {
    return this._id;
}

module.exports = mongoose.model("Booking", bookingsSchema);