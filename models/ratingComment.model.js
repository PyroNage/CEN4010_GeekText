const mongoose = require('mongoose');


var ratingCommentSchema = new mongoose.Schema({
    rc_isbn: String,
    comments: String,
    ratings: Number,
    date: Date
});


module.exports = mongoose.model('ratingComment', ratingCommentSchema);