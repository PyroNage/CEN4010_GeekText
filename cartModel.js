'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ShoppingCartSchema = new Schema({
    isbn: [String], //will be used to look up books
    quantity: [Number], //how much of each book is wanted
    ownerID: String     //to know which user this cart belongs to
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);