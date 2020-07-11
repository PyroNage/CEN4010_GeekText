const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const app = express();

// Schema Models
var User = require('./models/userModel');



// Replace process.env.DB_URL with your actual connection string
// const connectionString = process.env.DB_URL =============================
//const connectionString = process.env.DB_URI

/**
 * Objects for all database collections
 */
var allUsers = {};


/**
 * Functions to refresh database
 *
 */
function getAllUsers(){
    User.find({}, function (err, user) {
        allUsers = user;
    });
}

function getUserByUsername(passedUsername){
    User.find({email: passedUsername}, function (err, user) {

        console.log(user);
        return user;
    });
}

var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
    // Log Error
    if (err) {
        console.error('Could not connect to MongoDB!');
        console.log(err);
    } else {
        // Enabling mongoose debug mode if required
        mongoose.set('debug', config.db.debug);
        console.log('Connected to Database');

        /**
         * Call the population of database objects here:
         */

        // Users
        getAllUsers();

        // Books


    }
}).then(client => {

    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('public'));

    // ========================
    // Routes
    // ========================


    // Home Page

    app.get('/', (req, res) => {
        // getAllUsers();
        res.render('index.ejs', { users: allUsers , isLoggedIn: false })
    });

    /**
     * ########## login and Sign-up routes #################
     *
     * GET to /login renders the html for the login page
     * POST to /login submits the request to the API to login
     *
     * GET to /signup renders the html for the sign up page
     * POST to /signup submits the request to the API to sign up
     *
     */

    app.get('/login', (req, res) => {
        res.render('login.ejs')
    });

    app.post('/login', (req, res) => {
        // res.render('login.ejs')
    });

    /**
     * ########## End of login and Sign-up routes #################
     */

    // Page to create user
    app.get('/createUser', (req, res) => {
        // getAllUsers();
        res.render('createUser.ejs')
    });

    // Post request to API to create user
    app.post('/createUser', (req, res) => {
        User.create(req.body)
        .then(result => {
            getAllUsers();
            res.redirect('/')
        })
        .catch(error => console.error(error))
    });

    app.get('/findUser', (req, res) => {
        // getAllUsers();
        res.render('findUser.ejs', { users: allUsers })
    });

    app.post('/findUser', (req, res) => {
        // getAllUsers();

        User.find({email: req.body.username}, function (err, user) {
            if(err){
                res.status(500).json(err);
            }

            res.render('findUser.ejs', { users: user })
        });
    });



    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Deleted Darth Vadar\'s quote')
        })
        .catch(error => console.error(error))
    })

    // ========================
    // Listen
    // ========================
    const isProduction = process.env.NODE_ENV === 'production'
    const port = isProduction ? 7500 : 3000
    app.listen(process.env.PORT || 3000, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)
