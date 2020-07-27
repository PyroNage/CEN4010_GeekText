const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

// Schema Models
var User = require('./models/userModel');

function initialize(passport) {
    passport.use(new LocalStrategy(
        {
        usernameField: 'email',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function() {
                User.findOne({ 'email' :  email },{password:1, email:1}, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                        return done('Email or password is invalid', false, console.log('no user found'));

                    if (!user.validPassword(password))
                        return done('Email or password is invalid', false, console.log('wrong password'));

                    // All is well, returning user
                    return done(null, user);
                });
            });

        }));

    // used to serialize the user
    passport.serializeUser((user, done) => done(null, user.id));

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}

module.exports = initialize
