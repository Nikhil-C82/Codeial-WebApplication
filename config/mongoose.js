const mongoose = require('mongoose');
const env = require('./environment');
mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error on connecting db"));

db.once('open',function(){
    console.log('Successfully Connected DB');
});

module.exports = db;
