var mongoose = require('mongoose');
//var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;
var passwordHash = require('password-hash');

var userSchema = new Schema({
	'email' : String,
	'username' : String,
	'password' : String,
	'public_key' : String,
	'private_key' : String,
	'cash' : Number,
	'v_pts' : Number
	
});



//authenticate input against database
userSchema.statics.authenticate = function (username, password, callback) {
  // User.findOne({ username: username }).exec(function (err, user) {
      // if (err) {
		// return callback(err)
      // } 
	  // else if (!user) {
        // var err = new Error('User not found.');
        // err.status = 401;
        // return callback(err);
      // }
	  
	  
	  
	  // if(passwordHash.verify(password, user.password)){
		  // return callback(null, user);
	  // }
	  // else{
		  // return callback();
	  // }
      // // bcrypt.compare(password, user.password, function (err, result) {
        // // if (result === true) {
          // // return callback(null, user);
        // // } 
		// // else {
          // // return callback();
        // // }
      // // })
	  
	  
	  
    // });
}


//hashing a password before saving it to the database
// userSchema.pre('save', function (next) {
  // var user = this;
  // bcrypt.hash(user.password, 10, function (err, hash) {
    // if (err) {
      // return next(err);
    // }
    // user.password = hash;
    // next();
  // })
// });





var User = mongoose.model('User', userSchema);
module.exports = User;
