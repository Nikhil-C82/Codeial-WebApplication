const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codial_development');

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error on connecting db"));

db.once('open',function(){
    console.log('Successfully Connected DB');
});

module.exports = db;
