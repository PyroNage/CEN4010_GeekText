//--------

const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//const Book = mongoose.model('Book')
//const Author = mongoose.model('Author');
var Author = require('../models/author.model');


//AUTHOR
router.get('/',(req,res)=>{
    res.render("authorAddOrEdit.hbs", {
        viewTitle: "Insert Author"
    });
});

router.get('/authorList', (req, res) => {
    Author.find((err, docs) => {
        if(req.query.search) {

        }
        if (!err) {
            res.render("authorList.hbs", {
                authorList: docs
            });
        }
        else {
            console.log('Error in retrieving author list :' + err);
        }
    });
});

router.post('/',(req,res) =>{
    if (req.body._id === '')
        insertAuthor(req,res);
    else
        updateAuthor(req, res);
});


function insertAuthor(req,res){
    var author = new Author();
    author.author_fname = req.body.author_fname;
    author.author_lname = req.body.author_lname;
    author.author_biography = req.body.author_biography;
    author.author_publisher = req.body.author_publisher;
    author.save((err, doc) => {
        if(!err)
            res.redirect('author/authorList');
        else
            console.log('Error during record insertion : ' + err);
    });
}

function updateAuthor(req, res) {
    Author.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true, useFindAndModify: true }, (err, doc) => {
        if (!err) { res.redirect('author/authorList'); }
        else {
            console.log('Error during record update : ' + err);
        }
    });
}

router.get('/:id', (req, res) => {
    Author.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("authorAddOrEdit.hbs", {
                viewTitle: "Update Author",
                author: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Author.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('http://localhost:3000/author/authorList');
        }
        else { console.log('Error in book delete :' + err); }
    });
});

module.exports = router;

