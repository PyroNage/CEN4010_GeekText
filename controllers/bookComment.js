const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');
const mongoose = require('mongoose');
const app = express();
const book = require('../models/book.model');
const user = require('../models/userModel');

function createComment(book, user)
{
    // HOW DO I CREATE A TEXT PROMPT FOR COMMENTS???
    let commentStr = prompt('Comment test');
    let comment = String(commentStr);

    let feedback = String.length > 0 ?
        'You cannot send an empty comment.' :
        'Comment success' ;

    alert(feedback);
    return comment;
}