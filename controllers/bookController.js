const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Book = mongoose.model('Book')
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

router.post('/',(req,res) =>{
    if (req.body._id === '')
        insertBook(req,res);
    else
        updateBook(req, res);
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

function insertBook(req,res){
    var book = new Book();
    book.title = req.body.title;
    book.author = req.body.author;
    book.description = req.body.description;
    book.isbn = req.body.isbn;
    book.price = req.body.price;
    book.genre = req.body.genre;
    book.publisher = req.body.publisher;
    book.yearPublished = req.body.yearPublished;
    book.copiesSold = req.body.copiesSold;
    book.save((err, doc) => {
        if(!err)
            res.redirect('http://localhost:3000/book/list');
        else
            console.log('Error during record insertion : ' + err);
    });
}

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

