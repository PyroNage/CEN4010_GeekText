'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    }
});

module.exports = mongoose.model('User', UserSchema);