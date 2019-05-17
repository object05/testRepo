var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var entrySchema = new Schema({
	'currency' : String,
	'amount' : Number,
	'user' : String,
	'user_id' : String,
	'buy_sell' : String,
	'price' : Number,
	'time' : String
});

module.exports = mongoose.model('entry', entrySchema);
