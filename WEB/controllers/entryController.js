var entryModel = require('../models/entryModel.js');
var userModel = require('../models/userModel.js');
var WebSocket = require('ws');



/**
 * entryController.js
 *
 * @description :: Server-side logic for managing entrys.
 */
module.exports = {

    /**
     * entryController.list()
     */
    list: function (req, res) {
        entryModel.find(function (err, entrys) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting entry.',
                    error: err
                });
            }
            //return res.json(entrys);
			res.render('entry/list', entrys);
        });
    },
	
	trade: function (req, res){
		var id = req.body.offer;
		entryModel.findOne({_id: id}, function (err, entry) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting entry.',
                    error: err
                });
            }
            if (!entry) {
                return res.status(404).json({
                    message: 'No such entry'
                });
            }
            //return res.json(entry);
			//found specific entry, result is entry
			var user_id = req.session.userId;
			userModel.findOne({_id: user_id}, function (err, user) {
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
				//return res.json(user);
				//found myself, result is user
				
				if(entry.buy_sell == "sell"){//session bo kupil nekaj
					if(user.cash >= entry.price){//ma dovol dnarja, sessionu amount of item, -cash, drugemu userju + cash, -amount of item
						userModel.findOne({_id: entry.user_id}, function (err, user2) {
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
							//ce ma user2 dovol enot se preverja ze na uploadu entrija tak da ni panike
							//return res.json(user2);
							//found seller/buyer, result is user2
							
							//user == session, user2 == entry owner
							var pwd = user.password;
							
							user.email = user.email;
							user.username = user.username;
							user.password = pwd;
							user.cash = user.cash - entry.price;
							user.v_pts = user.v_pts + entry.amount;//TODO ni nujno da v_pts
							
							user.save(function (err, user) {
								if (err) {
									return res.status(500).json({
										message: 'Error when updating user.',
										error: err
									});
								}
								
								pwd = user2.password;
								
								user2.email = user2.email;
								user2.username = user2.username;
								user2.password = pwd;
								user2.cash = user2.cash + entry.price;
								user2.v_pts = user2.v_pts - entry.amount;//TODO ni nujno da v_pts
								
								user2.save(function (err, user2) {
									if (err) {
										return res.status(500).json({
											message: 'Error when updating user.',
											error: err
										});
									}

									entryModel.findOneAndDelete(entry._id, function (err, entry) {
										if (err) {
											return res.status(500).json({
												message: 'Error when deleting the entry.',
												error: err
											});
										}
										//REDIRECT MAYBE?
										
										var masterSocket = new WebSocket('ws://localhost:3001');
										var objectToSend = {
											"type": 8,
											"data":"sda"
										};
										masterSocket.send(objectToSend);
										res.redirect("/users/market");
									});
								});
							});
						});	
					}
				}
				else{//session bo prodal nekaj
					if(user.v_pts >= entry.amount){//ma dovol dnarja, sessionu amount of item, -cash, drugemu userju + cash, -amount of item
						userModel.findOne({_id: entry.user_id}, function (err, user2) {
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
							//ce ma user2 dovol enot se preverja ze na uploadu entrija tak da ni panike
							//return res.json(user2);
							//found seller/buyer, result is user2
							
							//user == session, user2 == entry owner
							var pwd = user.password;
							
							user.email = user.email;
							user.username = user.username;
							user.password = pwd;
							user.cash = user.cash + entry.price;
							user.v_pts = user.v_pts - entry.amount;//TODO ni nujno da v_pts
							
							user.save(function (err, user) {
								if (err) {
									return res.status(500).json({
										message: 'Error when updating user.',
										error: err
									});
								}
								
								pwd = user2.password;
								
								user2.email = user2.email;
								user2.username = user2.username;
								user2.password = pwd;
								user2.cash = user2.cash - entry.price;
								user2.v_pts = user2.v_pts + entry.amount;//TODO ni nujno da v_pts
								
								user2.save(function (err, user2) {
									if (err) {
										return res.status(500).json({
											message: 'Error when updating user.',
											error: err
										});
									}

									//return res.json(user);
									//console.log("SUCCESS");
									//USPESNO TREJDANO
									//NEED TO DELETE ENTRY
									//var id = req.params.id;
									entryModel.findOneAndDelete(entry._id, function (err, entry) {
										if (err) {
											return res.status(500).json({
												message: 'Error when deleting the entry.',
												error: err
											});
										}
										//REDIRECT MAYBE?
										res.redirect("/users/market");
									});
								});
							});
						});	
					}					
				
				}
			});
        });
	},

    /**
     * entryController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        entryModel.findOne({_id: id}, function (err, entry) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting entry.',
                    error: err
                });
            }
            if (!entry) {
                return res.status(404).json({
                    message: 'No such entry'
                });
            }
            return res.json(entry);
        });
    },

    /**
     * entryController.create()
     */
    create: function (req, res) {
		
		var b_s;
		if(req.body.buy_sell == true){
			b_s = "buy";
		}
		else{
			b_s = "sell";
		}
		
		var timestamp = Date.now();
        var entry = new entryModel({
			currency : req.body.currency,
			amount : req.body.amount,
			user : req.body.user,
			user_id : req.body.user_id,
			buy_sell : b_s,
			price : req.body.price,
			time : timestamp

        });

        entry.save(function (err, entry) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating entry',
                    error: err
                });
            }
            //return res.status(201).json(entry);
			res.redirect("/users/market")
        });
		
    },

    /**
     * entryController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        entryModel.findOne({_id: id}, function (err, entry) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting entry',
                    error: err
                });
            }
            if (!entry) {
                return res.status(404).json({
                    message: 'No such entry'
                });
            }

            entry.currency = req.body.currency ? req.body.currency : entry.currency;
			entry.amount = req.body.amount ? req.body.amount : entry.amount;
			entry.user = req.body.user ? req.body.user : entry.user;
			entry.user_id = req.body.user_id ? req.body.user_id : entry.user_id;
			entry.buy_sell = req.body.buy_sell ? req.body.buy_sell : entry.buy_sell;
			entry.price = req.body.price ? req.body.price : entry.price;
			entry.time = req.body.time ? req.body.time : entry.time;
			
            entry.save(function (err, entry) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating entry.',
                        error: err
                    });
                }

                return res.json(entry);
            });
        });
    },

    /**
     * entryController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        entryModel.findByIdAndRemove(id, function (err, entry) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the entry.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
