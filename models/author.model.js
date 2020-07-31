const mongoose = require('mongoose');

var authorSchema = new mongoose.Schema({
    author_fname: {
        type: String,
        required: 'This field is required.'
    },
    author_lname: {
        type: String,
        required: 'This field is required.'
    },
    author_biography: {
        type:String
    },
    author_publisher:{
        type:String
    }
});

module.exports = mongoose.model('Author', authorSchema);