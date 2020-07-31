/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookSchema = new Schema({
    bookName: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        default: ''
        //,validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    bookGenre: {
        type: String,
        trim: true,
        default: ''
        //,validate: [validateLocalStrategyProperty, 'Please fill in your last name']
    },
    bookSales: {
        type: Number,
        default: ''
        //,validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
    },
    bookRating: {
        type: Number,
        default: ''
        //,validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
    }
});

// module.exports = mongoose.model('Book', BookSchema);