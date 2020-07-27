const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passport-config');
initializePassport(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const app = express();

// Schema Models
var User = require('./models/userModel');

// Controllers
var userManagement = require('./controllers/userManagementController.js');
var bookRating = require('./controllers/bookRating.js');
var bookRating = require('./controllers/bookComment.js');

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
    app.use(flash());
    app.use(session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // ========================
    // Routes
    // ========================


    // Home Page

    app.get('/', (req, res) => {
        let isLoggedIn = false;
        //Check if user is logged in
        if(req.user){
            isLoggedIn = true;
        }
        res.render('index.ejs', { users: allUsers , isLoggedIn: isLoggedIn })
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
        // If a user is logged in, redirect to home
        if(req.user){
            res.redirect('/');
        } else {
            // Otherwise render the log in page
            res.render('login.ejs')
        }
    });

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true })
    );

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get('/signup', (req, res) => {
        res.render('signup.ejs')
    });

    app.post('/signup', async (req, res) => {
        try {
            // Hashed password to store in db
            req.body.password = await bcrypt.hash(req.body.password, 10)

            User.create(req.body, function (err, user) {
                // If there is an error creating the user
                if(err){
                    // Return a status 500 (internal server error) with the error object to display
                    res.status(500).json({'Error creating user': err});
                } else {
                    // Since there is no error, return to home. (We definitely want to log in the user here before we return home)
                    res.redirect('/login')
                }
            });
        } catch {
            res.redirect('/signup')
        }
    });

    /**
     * ########## End of login and Sign-up routes #################
     */

    /**
     * ########## User Management Routes #################
     *
     * GET to /myAccount renders the html for the my account page
     * POST to /updateUser submits the request to the API to update User information
     *
     */

    app.get('/myAccount', isLoggedIn, (req, res) => {
        res.render('myAccount.ejs',{ loggedInUser: req.user })
    });

    app.get('/editUser', isLoggedIn, (req, res) => {
        res.render('editUser.ejs',{ loggedInUser: req.user })
    });

    app.post('/updateUser', (req, res) => {
        let edituser = req.body;
        let conditions = { _id: req.user.id };

        User.findOneAndUpdate(conditions,{$set: edituser}, { runValidators: true, useFindAndModify: false },function(err,data){
            if(err){
                console.log("An error ocurred saving the user.");
                console.log(err);
                return res.status(401).json({'Error Updating User': err});
            }
            console.log('User Successfully Updated.');
            res.redirect('/myAccount')
        });
    });

    app.get('/changePassword', isLoggedIn, (req, res) => {
        res.render('changePassword.ejs');
    });

    app.post('/changePassword/', isLoggedIn, (req, res) => {
        User.findOne({'_id': req.user.id},{password:1, email:1},async function(err,user){
            if(err){
                console.log(err);
                return res.status(500).end();
            }
            if(user.validPassword(req.body.password)){
                console.log('Password match');
                user.password = await bcrypt.hash(req.body.newPassword, 10)
                user.save(function(err) {
                    if (err){
                        console.log(err);
                        return res.status(500).end();
                    }else{
                        console.log('Password Successfully Updated.');
                        res.redirect('/myAccount')
                    }
                });
            }else{
                //Password Mismatch
                console.log('Password Mismatch');
                return res.status(401).json({'Error Updating password': 'Password Mismatch'});
            }
        });
    });

    app.get('/manageCreditCards', isLoggedIn, (req, res) => {
        res.render('manageCreditCards.ejs',{ loggedInUser: req.user })
    });

    app.post('/addCreditCard', isLoggedIn, (req, res) => {
        let currentUser = req.user;
        currentUser.creditCards.push(req.body);
        let conditions = { _id: req.user.id };

        User.findOneAndUpdate(conditions,{$set: currentUser}, { runValidators: true, useFindAndModify: false },function(err,data){
            if(err){
                console.log("An error ocurred adding the credit card.");
                console.log(err);
                return res.status(401).json({'Error Adding Credit Card': err});
            }
            console.log('Successfully added Credit Card.');
            res.redirect('/myAccount')
        });
    });

    app.post('/deleteCreditCard', isLoggedIn, (req, res) => {
        let currentUser = req.user;
        let cardToDelete = currentUser.creditCards[req.query.cardIndex];

        const indexOfCardInUserObject = currentUser.creditCards.indexOf(cardToDelete);
        if (indexOfCardInUserObject > -1) {
            currentUser.creditCards.splice(indexOfCardInUserObject, 1);
        }

        let conditions = { _id: req.user.id };

        User.findOneAndUpdate(conditions,{$set: currentUser}, { runValidators: true, useFindAndModify: false },function(err,data){
            if(err){
                console.log("An error ocurred deleting the credit card.");
                console.log(err);
                return res.status(401).json({'Error Deleting Credit Card': err});
            }
            console.log('Successfully Deleted Credit Card.');
            res.redirect('/manageCreditCards')
        });
    });

    /**
     * ########## End of User Management routes #################
     */


    // Page to create user
    app.get('/createUser', (req, res) => {
        // getAllUsers();
        res.render('createUser.ejs')
    });

    // Post request to API to create user
    app.post('/createUser',async (req, res) => {
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

    // ========= Logged In middleware =========
    function isLoggedIn(req, res, next) {
        if(req.isAuthenticated()){
            return next()
        }

        // If user is not logged in, redirect to login page.
        res.redirect('/login')
    }

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
