const mongoose = require('mongoose');


var ratingCommentSchema = new mongoose.Schema({
    // belongsTo: {
    //     type: Schema.Types.ObjectId, required: true, ref: 'Book'
    // },
    rc_isbn: String,
    comments: String,
    ratings: Number
});


module.exports = mongoose.model('ratingComment', ratingCommentSchema);