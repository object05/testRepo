var userModel = require('../models/userModel.js');
var entryModel = require('../models/entryModel.js');
var passwordHash = require('password-hash');
//var bcrypt = require('bcrypt');
const secureRandom = require('secure-random');
var EC = require('elliptic').ec;
var FS = require('fs');
//import {ec} from 'elliptic';
const WebSocket = require('ws');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
 
 
const ec = new EC('secp256k1');
const privateKeyLocation = process.env.PRIVATE_KEY || 'node/wallet/private_key';


function getPrivateFromWallet(){	
	const buffer = FS.readFileSync(privateKeyLocation, 'utf8');
    return buffer.toString();
}

function getPublicFromWallet(){
    const privateKey = getPrivateFromWallet();
    const key = ec.keyFromPrivate(privateKey, 'hex');
    return key.getPublic().encode('hex');
};

function generatePrivateKey(){
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};


function initWallet(){
    // let's not override existing private keys
    if (FS.existsSync(privateKeyLocation)) {
        console.log("You already have a private key, so none created");
        return;
    }
    const newPrivateKey = generatePrivateKey();

    FS.writeFileSync(privateKeyLocation, newPrivateKey);
    console.log('new wallet with private key created to : %s', privateKeyLocation);
};

function deleteWallet(){
    if (FS.existsSync(privateKeyLocation)) {
        FS.unlinkSync(privateKeyLocation);
    }
};



module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        userModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        userModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            return res.json(user);
        });
    },

	indexPage: function(req,res){
		return res.render('user/index');
	},

	showMarket: function(req,res){
		userModel.findById(req.session.userId).exec(function (error, user) {
			  if (error) {
				return next(error);
			  } 
			  else {
				if (user === null) {
					var err = new Error('Not authorized! Go back!');
					err.status = 400;
					//return next(err);
					res.redirect('/users/login');
				} else {
					res.render('user/market', user);
				}
			  }
		});
	},

	sendShow: function(req,res){
		return res.render('user/send');
	},
	receiveShow: function(req,res){
		return res.render('user/receive');
	},

	testTransaction: function(req, res){
		// const ws = new WebSocket('ws://localhost:3001');
		// console.log("we here");
		var object = {
			'type' : 8,
			'data' : "test"
		};
		// ws.send(object);
		console.log("we here 1");
		const url = 'ws://localhost:6001';
		console.log("we here 2");
		const connection = new WebSocket(url);
		console.log("we here 3");
		//connection.send(object);
			
		connection.onopen = function (event) {
			//exampleSocket.send("Here's some text that the server is urgently awaiting!"); 
			connection.send(JSON.stringify(object));
		};
			
		console.log("shit sent");
		
	},



    /**
     * userController.create()
     */
    create: function (req, res) {
		// var ecdsa = new EC('secp256k1');
		
		
		// let privateKey = secureRandom.randomBuffer(32);
		// const keys = ecdsa.keyFromPrivate(privateKey);  
		// const publicKey = keys.getPublic('hex');  
		//console.log('> Public key created: ', publicKey);
		
		
		
		//bcrypt.hash(req.body.password, 10, function (err, hash) {
		// if (err) {
			// return next(err);
		// }
		//user.password = hash;
		//next();
		
		var hashedPassword = passwordHash.generate(req.body.password);
		
		var user = new userModel({
			email : req.body.email,
			username : req.body.username,
			password : hashedPassword,
			//public_key : publicKey,
			//private_key : privateKey,
			cash : 1000,
			v_pts : 1000

		});

		user.save(function (err, user) {
			if (err) {
				return res.status(500).json({
					message: 'Error when creating user',
					error: err
				});
			}
			
			//initWallet();
			return res.redirect('users/login');
			//return res.status(201).json(user);
		});
			
			
		//})
				
		
		
		

    },
    /**
     * userController.login()
     */
    showLogin: function (req, res) {
         res.render('user/login');
    }
    ,
	loginPage: function (req, res) {
         res.render('/users/login');
    },
    showRegister: function (req, res) {
        res.render('user/register');
    },
    login: function (req, res,next) {
		// userModel.authenticate(req.body.username, req.body.password, function (error, user) {
		// if (error || !user) {
			// var err = new Error('Wrong username or password.');
			// err.status = 401;
			// return next(err);
		// } else {
			// req.session.userId = user._id;
			// req.session.username = user.username;
			// initWallet();
			// //return res.redirect('profile');
			// return res.redirect('/users/index'); 
		// }
		// })
		
		
		userModel.findOne({ username: req.body.username }).exec(function (err, user) {
		  if (err) {
			//return callback(err)
			next(err);
		  } 
		  else if (!user) {
			var err = new Error('User not found.');
			err.status = 401;
			return next(err);
		  }
		  
		  
		  
		  if(passwordHash.verify(req.body.password, user.password)){
			  req.session.userId = user._id;
			  req.session.username = user.username;
			  initWallet();
			  return res.redirect('/users/index'); 
		  }
		  else{
			var err = new Error('Wrong username or password');
			err.status = 401;
			return next(err);
		  }	  
		  
		});
		

	},
    /**
     * userController.login()
     */

    logout: function (req, res,next) {
		if (req.session) {
    // delete session object
			req.session.destroy(function (err) {
			  if (err) {
				return next(err);
			  } 
			  else {
				return res.redirect('/');
			  }
			});
		}
	},
        /**
     * userController.profil()
     */

    profile: function (req, res,next) {
		userModel.findById(req.session.userId).exec(function (error, user) {
		if (error) {
			return next(error);
		} 
		else {
			if (user === null) {
				var err = new Error('Not authorized! Go back!');
				err.status = 400;
			  //return next(err);
				res.redirect('/users/login');
			} 
			else {
			  res.render('user/profile', user);
			}
		}
		});
	},
    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        userModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.email = req.body.email ? req.body.email : user.email;
			user.username = req.body.username ? req.body.username : user.username;
			user.password = req.body.password ? req.body.password : user.password;
			user.cash = req.body.cash ? req.body.cash : user.cash;
			user.v_pts = req.body.v_pts ? req.body.v_pts : user.v_pts;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        userModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
