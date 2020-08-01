const mongoose = require('mongoose');


var bookSchema = new mongoose.Schema({
    title: {
        type: String,
        //required: 'This field is required.'
    },
    author: {
        type: String,
        //required: 'This field is required.'
    },
    description: {
        type:String,
        //required: 'This field is required.'
    },
    isbn: {
        type: String
    },
    price: {
        type:Number

    },
    genre: {
        type: String

    },
    publisher: {
        type: String

    },
    yearPublished: {
        type: Number
    },
    copiesSold: {
        type: Number
    },
    ratings: {
        type: Number
    },
    comments: [String]
});


//employeeSchema.path;
module.exports = mongoose.model('Book', bookSchema);