const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');
var router = express.Router();
const mongoose = require('mongoose');
const app = express();
const Book = require('../models/book.model.js')

function createRating()
{
    //
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
  let star_rating = 5;
  console.log('I work at LAAAAAAAAAAST');
}