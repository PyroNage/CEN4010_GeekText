'use strict';

/**
 * Module dependencies.
 */

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { list } = require('pm2');
const Schema = mongoose.Schema;

/**
 * Credit Card Data object.
 * Nested inside the user object.
 */
var creditCard = new Schema({
    cardName: {
        type: String,
        default: ''
    },
    cardNumber : {
        type: Number,
    },
    cardAddress : {
        type: String,
        default: ''
    },
    cardType: {
        type: String,
        enum : ['Visa','Master Card','American Express'],
        default: 'Visa'
    },
    cardExpiration: {
        type: Date
        // Storing as ISOdate but all we care about is the month and year
    },
    cardCCV: {
        type: Number
    }
});

/**
 * Wishlist Data object.
 * Nested inside the user object.
 */

var WishlistSchema = mongoose.Schema({
    listName: {
        type: String,
    },
    listContents: {
        type: [String],
        default: []
    }
});


var UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: ''
        //,validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    lastName: {
        type: String,
        trim: true,
        default: ''
        //,validate: [validateLocalStrategyProperty, 'Please fill in your last name']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        default: ''
        //,validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
    },
    password: {
        type: String,
        default: ''
    },
    homeAddress: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // bookComment: {
    //     type: list,
    //     default: ''
    // },
    // bookRating: {
    //     type: list,
    //     default: ''
    // },
    // creditCards is an array storing our creditCard objects
    creditCards: [creditCard],
    Wishlist: [WishlistSchema]
});

UserSchema.methods.validPassword = function(password) {
    if(!password || !this.password) return false;
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.validPassword = function(password) {
    if(!password || !this.password) return false;
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);