const express = require('express');
var router = express.Router();
const config = require('../config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const Book = mongoose.model('Book')
var Book = require('../models/book.model');
//const Author = mongoose.model('Author');




// SEARCH RESULTS
router.get('/result',(req,res)=>{
    res.render("result.hbs", {
        viewTitle: "ISBN or Author Search"
    });
});

router.post('/result',(req,res) => {
    var searchItem = req.body.search;
    Book.find({$or:[{author: searchItem},{isbn: searchItem}]}, function (err, book) {
        if (!err) {
            return res.render("result.hbs", {
                viewTitle: "ISBN or Author Search",
                book:book
            });
        } else throw err;
    });
})

//BOOK
router.get('/',(req,res)=>{
    res.render("addOrEdit.hbs", {
        viewTitle: "Insert Book"
    });
});

router.post('/', (req, res) => {
    if (req.body._id === '') {
        req.body._id = undefined;
        insertBook(req, res);
    } else {
        updateBook(req, res);
    }
});

router.get('/list', (req, res) => {
    Book.find((err, docs) => {
        if (!err) {
            res.render("list.hbs", {
                list: docs
            });
        }
        else if(req.query.search) {

        }
        else {
            console.log('Error in retrieving book list :' + err);
        }
    });
});

async function insertBook(req, res) {
    Book.create(req.body)

    .then(result => {
        res.redirect('http://localhost:3000/book/list');
    })
    .catch(error => console.log('Error during record insertion : ' + error))
};

function updateBook(req, res) {
    Book.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true, useFindAndModify: true }, (err, doc) => {
        if (!err) { res.redirect('book/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("addOrEdit.hbs", {
                    viewTitle: 'Update Book',
                    book: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'Title':
                body['titleNameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Book.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("addOrEdit.hbs", {
                viewTitle: "Update Book",
                book: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Book.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/book/list');
        }
        else { console.log('Error in book delete :' + err); }
    });
});

module.exports = router;

