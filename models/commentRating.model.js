const mongoose = require('mongoose');


var commentRatingSchema = new mongoose.Schema({
    belongsTo: {
        type: Schema.Types.ObjectId, required: true, ref: 'Book'
    },
    comments: [],
    ratings: []
});


module.exports = mongoose.model('CommentRating', commentRatingSchema);