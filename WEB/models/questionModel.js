var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var questionSchema = new Schema({
	'title' : String,
	'description' : String,
	'tags' : Array,
	'date' : Date,
	'owner' : String
});

module.exports = mongoose.model('question', questionSchema);
