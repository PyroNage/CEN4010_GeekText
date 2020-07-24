const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
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

function createComment(a)
{
    // HOW DO I CREATE A TEXT PROMPT FOR COMMENTS???
    let commentStr = prompt('Comment test');
    let comment = String(commentStr);

    let feedback = String.length > 0 ?
        'You cannot send an empty comment.' :
        
        // FUNCTION TO SEND COMMENT TO SERVER
}