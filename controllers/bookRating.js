const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');
const mongoose = require('mongoose');
const app = express();
const book = require('../models/book.model');
const user = require('../models/userModel');

function createRating(book, user)
{
    // HOW DO I CREATE A PROMPT FOR RATINGS???
    let ratingStr = prompt('Comment test');
    let rating = Int(commentStr);

    let feedback = 1 <= rating && rating <= 5?
        'Ratings must be from 1 to 5.' :
        'Success!' ;
    
    alert(feedback);
    return rating;
}

exports.test = function()
{
  console.log('I work at LAAAAAAAAAAST');
}