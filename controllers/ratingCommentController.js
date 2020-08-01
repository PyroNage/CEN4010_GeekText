const express = require('express');
var router = express.Router();
const config = require('../config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const Book = mongoose.model('Book')
var ratingComment = require('../models/ratingComment.model');
//const Author = mongoose.model('Author');

// router.get('/',(req,res)=>{
//     res.render("ratingComment.hbs", {
//         viewTitle: "Rating and Commenting"
//     });
// });

router.get('/',(req,res)=>{
    res.render("ratingComment.hbs", {
        viewTitle: "Rating and Commenting"
    });
});

router.get('/addOrEdit',(req,res)=>{
    res.render("ratingCommentAddOrEdit.hbs", {
        viewTitle: "Rating and Commenting"
    });
});

router.post('/', (req, res) => {
    if (req.body._id === '') {
        req.body._id = undefined;
        insertRatingComment(req, res);
    } else {
        console.log('Error error');
    }
});

router.get('/list', (req, res) => {
    ratingComment.find((err, docs) => {
        if (!err) {
            res.render("ratingComment.hbs", {
                ratingComment: docs
            });
        }
        else if(req.query.search) {

        }
        else {
            console.log('Error in retrieving book list :' + err);
        }
    });
});

router.get('/addOrEdit', (req, res) => {
    ratingComment.find((err, docs) => {
        if (!err) {
            res.render("ratingCommentAddOrEdit.hbs", {
                ratingComment: docs
            });
        }
        else if(req.query.search) {

        }
        else {
            console.log('Error in retrieving book list :' + err);
        }
    });
});

async function insertRatingComment(req, res) {
    ratingComment.create(req.body)

    .then(result => {
        res.redirect('http://localhost:3000/ratingComment/list');
    })
    .catch(error => console.log('Error during record insertion : ' + error))
};

router.get('/:id', (req, res) => {
    ratingComment.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("ratingComment.hbs", {
                viewTitle: "Ratings and Comments",
                ratingComment: doc
            });
        }
    });
});

router.post('/ratingComment', (req, res) => {
    if (req.body._id === '') {
        req.body._id = undefined;
        insertRatingComment(req, res);
    } else {
        console.log('Error error');
    }
});
router.post('/addOrEdit', (req, res) => {
    if (req.body._id === '') {
        req.body._id = undefined;
        insertRatingComment(req, res);
    } else {
        console.log('Error error');
    }
});
module.exports=router;