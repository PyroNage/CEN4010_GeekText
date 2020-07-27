'use strict';
var path = require('path');


var all = {
    db: {
        uri: 'mongodb://ds245677.mlab.com:45677/cen4010project',
        options: {
            user: 'adminUser',
            pass: 'adminPassword1',
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        // Enable mongoose debug mode
        debug: false
    },
    statPath: {
        staticPath: path.join(__dirname, '../../client')
    },
    SESSION_SECRET: "STINKY"
};

module.exports = (
  all
);