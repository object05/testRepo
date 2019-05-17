var commentModel = require('../models/commentModel.js');

/**
 * commentController.js
 *
 * @description :: Server-side logic for managing comments.
 */
module.exports = {

    /**
     * commentController.list()
     */
    list: function (req, res) {
		commentModel.find({desc_comment: "comment1"}, function (err, comments) {
        //commentModel.find(function (err, comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }
            return res.render('comment/list',comments);
        });
    },
	
	listSpecific: function (req, res) {
		var ajdi = req.params.q_id;
		//commentModel.find({desc_comment: "comment1"}, function (err, comments) {
		commentModel.find({q_id: ajdi}, function (err, comments) {	
        //commentModel.find(function (err, comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }
            return res.render('comment/list',comments);
        });
    },
	listSpecific2: function (req, res) {
		var ajdi = req.params.q_id;
		//commentModel.find({desc_comment: "comment1"}, function (err, comments) {
		commentModel.find({q_id: ajdi}, function (err, comments) {	
        //commentModel.find(function (err, comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }
            return res.render('comment/listChosen',comments);
        });
    },
	
	listSpecific3: function (req, res) {
		var ajdi = req.params.q_id;
		var owna = req.params.own;
		if(owna == req.session.username){
			//commentModel.find({desc_comment: "comment1"}, function (err, comments) {
			commentModel.find({q_id: ajdi}, function (err, comments) {	
			//commentModel.find(function (err, comments) {
				if (err) {
					return res.status(500).json({
						message: 'Error when getting comment.',
						error: err
					});
				}
				return res.render('comment/listAdmin',comments);
			});
		}
    },
	
	listSpecific4: function (req, res) {
		var ajdi = req.params.q_id;
		//commentModel.find({desc_comment: "comment1"}, function (err, comments) {
		commentModel.find({q_id: ajdi}, function (err, comments) {	
        //commentModel.find(function (err, comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }
            return res.render('comment/listChosen',comments);
        });
    },
	
	listSpecificUser: function (req, res) {
		var ajdi = req.session.username;
		//commentModel.find({desc_comment: "comment1"}, function (err, comments) {
		commentModel.find({owner_comment: req.session.username}, function (err, comments) {	
        //commentModel.find(function (err, comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }
            return res.render('comment/listAdmin2',comments);
        });
    },
	
	
	
	
    /**
     * commentController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        commentModel.findOne({_id: id}, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment.',
                    error: err
                });
            }
            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                });
            }
            return res.json(comment);
        });
    },

    /**
     * commentController.create()
     */
    create: function (req, res) {
		
		if(req.session.username != ""){
	
			
			
			var datum = Date.now();
			
			var comment = new commentModel({
				desc_comment : req.body.desc_comment,
				q_id : req.body.q_id,
				owner_comment : req.body.owner_comment,
				chosen_comment : false,
				date_comment : datum
	
			});
	
			comment.save(function (err, comment) {
				if (err) {
					return res.status(500).json({
						message: 'Error when creating comment',
						error: err
					});
				}
				return res.redirect('questions/'+req.body.q_id);
				//return res.status(201).json(comment);
				//return res.redirect('users/login');
			});
		
		}
    },

    /**
     * commentController.update()
     */
	 
	test: function (req, res) {
		return res.render('comment/test');
	},
	 
    update: function (req, res) {
        //var id = req.params.id;
		var commt = req.params.c_id;

		
        commentModel.findOne({_id: commt}, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment',
                    error: err
                });
            }
            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                });
            }

            //comment.desc_comment = req.body.desc_comment ? req.body.desc_comment : comment.desc_comment;
			//comment.q_id = req.body.q_id ? req.body.q_id : comment.q_id;
			//comment.owner_comment = req.body.owner_comment ? req.body.owner_comment : comment.owner_comment;
			//comment.chosen_comment = true;
			//comment.date_comment = req.body.date_comment ? req.body.date_comment : comment.date_comment;
			
			comment.desc_comment = comment.desc_comment;
			comment.q_id = comment.q_id;
			comment.owner_comment = comment.owner_comment;
			comment.chosen_comment = true;
			comment.date_comment = comment.date_comment;
			
			
			
            comment.save(function (err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating comment.',
                        error: err
                    });
                }

                //return res.json(comment);
				return res.redirect('/questions/'+req.session.username+'/'+comment.q_id);
            });
        });
    },

    /**
     * commentController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        commentModel.findByIdAndRemove(id, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the comment.',
                    error: err
                });
            }
            //return res.status(204).json();
			res.redirect('/users/profile');
        });
    }
};
