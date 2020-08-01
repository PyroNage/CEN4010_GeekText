const mongoose = require('mongoose');

mongoose.connect('mongodb://ds245677.mlab.com:45677/cen4010project', {user:"adminUser",pass:"adminPassword1",useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (!err) { console.log('REGINE: MongoDB Connection Successful!')}
    else { console.log('REGINE: Error in DB connection: '+ err)}
});

require('./book.model');
require('./author.model');
require('./ratingComment.model');
