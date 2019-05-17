var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commentSchema = new Schema({
	'desc_comment' : String,
	'q_id' : String,
	'owner_comment' : String,
	'chosen_comment' : Boolean,
	'date_comment' : Date
});

module.exports = mongoose.model('comment', commentSchema);
