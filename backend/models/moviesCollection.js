const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    synopsis: {
        type: String,
        trim: true
    },
    genre: {
        type: String
    }
}, { timestamps: true });

movieSchema.methods.getMovieId = function () {
    return this._id;
}

module.exports = mongoose.model("Movie", movieSchema);