const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');
const mongoose = require('mongoose');
const app = express();

let books = [       //Making a sample array
    {
      b_name: "Harry Potter",
      b_rating: 3,
      b_genre: "fantasy",
      copies_Sold: 17
    },
    {
      b_name: "Mars Colony",
      b_rating: 29,
      b_genre: "science-fiction",
      copies_Sold: 10
    },
    {
      b_name: "Mars Colony23123",
      b_rating: 3,
      b_genre: "documentary",
      copies_Sold: 10
    },
    {
    b_name: "Black Rain Cloud",
      b_rating: 3,
      b_genre: "documentary",
      copies_Sold: 17
    },
    {
      b_name: "Random Facts",
      b_rating: 9,
      b_genre: "fantasy",
      copies_Sold: 13
    },
    {
      b_name: "Icarus",
      b_rating: 5,
      b_genre: "documentary",
      copies_Sold: 10
    },
    {
      b_name: "Steel in Space",
      b_rating: 1,
      b_genre: "science-fiction",
      copies_Sold: 20
    }
]

function createRating(a)
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