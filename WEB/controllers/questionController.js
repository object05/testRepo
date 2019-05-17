var questionModel = require('../models/questionModel.js');
var userModel = require('../models/userModel.js');

/**
 * questionController.js
 *
 * @description :: Server-side logic for managing questions.
 */
module.exports = {

    /**
     * questionController.list()
     */
    list: function (req, res) {
        questionModel.find(function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            return res.render('question/list',questions);
        });
    },
	
	loggedout: function (req, res) {
        questionModel.find(function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            return res.render('question/listlogged',questions);
        });
    },
	
	loggedout2: function (req, res) {
        var id = req.params.id;
        questionModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }
			return res.render('question/questionlogged', question);
            //return res.json(question);
        });
    },
	
	
	
	showByUser: function (req, res) {
		var id = req.params.owner;
        questionModel.find({owner: id},function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            return res.render('question/listAdmin',questions);
        });
    },
	
	dodaj: function (req, res) {
		
         //res.render('question/dodaj');
		var id = req.session.username;
		userModel.findOne({username: id},function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            //return res.render('question/listAdmin',questions);
			res.render('question/dodaj',questions);
        });
    },

    /**
     * questionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        questionModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }
			res.render('question/question', question);
            //return res.json(question);
        });
    },
	questionProfile: function (req, res) {
        var id = req.params.id;
        questionModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }
			res.render('question/question', question);
            //return res.json(question);
        });
    },
	
	adminView: function (req, res) {
        var id = req.params.id;
		var usr = req.params.usr;
		if(usr == req.session.username){
			questionModel.findOne({_id: id}, function (err, question) {
				if (err) {
					return res.status(500).json({
						message: 'Error when getting question.',
						error: err
					});
				}
				if (!question) {
					return res.status(404).json({
						message: 'No such question'
					});
				}
				res.render('question/questionAdmin', question);
				//return res.json(question);
			});
		}
    },
	

    /**
     * questionController.create()
     */
    create: function (req, res) {
		var username = req.session.userId;
		var datum = Date.now();
		var field = req.body.tags.split(" ");
		var returnval = "";
        var id = req.session.userId;
		userModel.findById(id).exec(function (error, user) {
		if (error) {
			return next(error);
		} 
		else {
			if (user === null) {
				var err = new Error('Not authorized! Go back!');
				err.status = 400;
				return next(err);
			}
			returnval = user.username;
			var question = new questionModel({
				title : req.body.title,
				description : req.body.description,
				tags : field,
				date : datum,
				owner : returnval
			});

			question.save(function (err, question) {
				if (err) {
					return res.status(500).json({
						message: 'Error when creating question',
						error: err
					});
				}
				return res.redirect('/questions/');
			});
		
		}
		});
    },

    /**
     * questionController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        questionModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question',
                    error: err
                });
            }
            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }

            question.title = req.body.title ? req.body.title : question.title;
			question.description = req.body.description ? req.body.description : question.description;
			question.tags = req.body.tags ? req.body.tags : question.tags;
			question.date = req.body.date ? req.body.date : question.date;
			question.owner = req.body.owner ? req.body.owner : question.owner;
			
            question.save(function (err, question) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating question.',
                        error: err
                    });
                }

                return res.json(question);
            });
        });
    },

    /**
     * questionController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        questionModel.findByIdAndRemove(id, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the question.',
                    error: err
                });
            }
            //return res.status(204).json();
			return res.redirect('/questions/');
        });
    },
	
	
	
	removeSafe: function (req, res) {
        var id = req.params.id;
		var owner = req.params.uname;
		console.log("asd");
		if(req.session.username == owner){//ce je to oseba ki je prijavlena
			questionModel.findOne({owner: req.session.username}, function (err, question) {//najdemo post s tem ownerom
				questionModel.findByIdAndRemove(id, function (err, question) {
					if (err) {
						return res.status(500).json({
							message: 'Error when deleting the question.',
							error: err
						});
					}
					return res.status(204).json();
				});
			});
		}
    }
};
