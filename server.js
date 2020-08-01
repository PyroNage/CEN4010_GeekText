const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');

// require('./models/db');

const initializePassport = require('./passport-config');
initializePassport(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const app = express();

// Schema Models
var User = require('./models/userModel');
var ShoppingCart = require('./models/shoppingCartModel');

// Controllers
var userManagement = require('./controllers/userManagementController.js');
var bookRating = require('./controllers/bookRating.js');
var bookComment = require('./controllers/bookComment.js');

const authorController = require('./controllers/authorController');
const bookController = require('./controllers/bookController');

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
    var engine = require('consolidate');

    app.engine('ejs',engine.ejs);
    app.engine('handlebars', engine.handlebars);

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('public'));
    app.use(flash());
    app.use(session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));

    app.set('views', path.join(__dirname, '/views/'));
    app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutDir: __dirname + 'views/layouts/' }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Regine server

    app.use('/book', bookController);
    app.use('/author', authorController);

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

    /**
     * Shopping Cart routes
     */

    app.get('/manageShoppingCart', isLoggedIn, (req, res) => {
        ShoppingCart.findOne({ownerID: req.user.id}, (err, sc)=>{
            if(err) res.status(401).json({'Error adding cart item': err});

            res.render('manageShoppingCart.ejs',{Cart: sc })
        });
    });

    
    /**
     * End of Shopping Cart routes
     */
	 
	     /**
     *  ########### Wishlist Management Routes #################
     */

    app.get('/Wishlist', isLoggedIn, (req, res) => {
        res.render('Wishlist.ejs', { loggedInUser: req.user});
    });

    app.post('/createWishlist', isLoggedIn, (req,res) => {
        let currentUser = req.user;
        currentUser.Wishlist.push(req.body);
        let conditions = { _id: req.user.id };

        User.findOneAndUpdate(conditions,{$set: currentUser}, {runValidators: true, useFindAndModify: false}, function(err,data){
            if(err){
                console.log("An error occurred creating the wishlist.");
                console.log(err);
                return res.status(401).json({'Error Creating Wishlist': err});
            }
            console.log('Successfully Created the Wishlist.');
            res.redirect('/Wishlist');
        });
    });

    app.get('/WishlistManagement', isLoggedIn, (req, res) => {
        res.render('WishlistManagement.ejs', {loggedInUser: req.user});
    })

    app.post('/addBook', isLoggedIn, (req,res) => {
        
        let currentUser = req.user;
        let conditions = { _id: req.user.id };


        // If req.body.listName == any of current users's Wishlist.listname
        for(let i = 0; i < currentUser.Wishlist.length; i++){
            if(currentUser.Wishlist[i].listName == req.body.listName){
                // Wishlist name in form matches a wishlist in the user object
                currentUser.Wishlist[i].listContents.push(req.body.listContents);
                console.log(req.body);
                console.log(currentUser);
                User.findOneAndUpdate( 
                    conditions, 
                    {$set: currentUser},
                    {runValidators: true, useFindAndModify: false}, function(err,data){
                        if (err)
                        {
                            console.log("An error occurred adding the book to the wishlist.");
                            console.log(err);
                            return res.status(401).json({'Error adding book': err});
                        }
                        console.log('Successfully added the book.');
                        res.redirect('/Wishlist');
            
                    }
                );
                break;
            } 
            else {
                // No wishlist in user had the name given, let's check if we have 3 wishlist's already
                if(currentUser.Wishlist.length < 3){
                    currentUser.Wishlist.push(req.body);
                } else {
                // Too many wishlist objects
                console.log("Too many wishlist objects.");
                }
            }
        }
    });

    app.post('/removeBook', isLoggedIn, (req,res) => {
        let currentUser = req.user;
        let conditions = { _id: req.user.id };

        for(let i = 0; i < currentUser.Wishlist.length; i++){
            // If req.body.listName == any of current users's Wishlist.listname
            if(currentUser.Wishlist[i].listName == req.body.listName){
                if (currentUser.Wishlist[i].listContents.length == 0 || currentUser.Wishlist[i].listContents == undefined)
                {
                    console.log('This wishlist is empty.');
                    res.redirect('/Wishlist');
                }
                else {
                    // Wishlist name in form matches a wishlist in the user object                    
                    ShoppingCart.findOne({ownerID: req.user.id},{_id:0}, function(err,cart){
                        if(err) return res.status(401).json({'Error adding cart item': err});
                        else{
                                if(cart.isbn.length <10){
                                cart.isbn.push(req.body.listContents);
                                cart.quantity.push(1);
                                ShoppingCart.findOneAndUpdate({ownerID: req.user.id},{$set: cart},function(err,Cart){
                                    if(err) return res.status(401).json({'Error adding cart item': err});
                                    res.redirect('/manageShoppingCart');
                });
                                }
                                else{
                alert("Your cart is full!");
                res.redirect('/Wishlist');
            }
        }
    });
                                    
                    currentUser.Wishlist[i].listContents.pull(req.body.listContents);
                    console.log(req.body);
                    console.log(currentUser);
                    User.findOneAndUpdate(
                        conditions,
                        {$set: currentUser},
                        {runValidators: true, useFindAndModify: false}, function(err,data){
                            if(err)
                            {
                                console.log("An error occurred removing the book to the wishlist.");
                                console.log(err);
                                return res.status(401).json({'Error removing book': err});
                            }
                            console.log('Successfully removed the book.');
                            res.redirect('/Wishlist');
                        }
                    );
                    break;
                }
            }
            else {
                console.log("The wishlist specified does not exist.");
            }
        }
    })
    
    /**
     *  ########## End of Wishlist Management routes #################
     */



    // Page to create user
    app.get('/createUser', (req, res) => {
        // getAllUsers();
        res.render('createUser.ejs')
    });

    // Post request to API to create user
    app.post('/createUser',async (req, res) => {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        User.create(req.body)

        .then(result => {
            res.redirect('/myAccount')
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
    // Ratings/Comments
    // ========================
    app.get('/ratings', (req, res) => {
        bookRating.test();
        res.render('index.ejs', { users: allUsers , isLoggedIn: false })
    });

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