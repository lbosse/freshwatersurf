var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our user model
var postSchema = new Schema({
    username    : String,
    content     : String,
    date        : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Post', postSchema);
