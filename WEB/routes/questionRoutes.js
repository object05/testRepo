var express = require('express');
var router = express.Router();
var questionController = require('../controllers/questionController.js');

function requiresLogin(req, res, next) {
console.log("auth!");
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
}




/*
 * GET
 */
router.get('/', questionController.list);
router.get('/dodaj',requiresLogin, questionController.dodaj);

/*
 * GET
 */
router.get('/:id', questionController.show);
router.get('/show/:id', questionController.questionProfile);
router.get('/user/:owner', questionController.showByUser);
router.get('/:usr/:id',questionController.adminView);
router.post('/logged',questionController.loggedout);
router.post('/logged/:id',questionController.loggedout2);

/*
 * POST
 */
router.post('/', questionController.create);
router.post('/del/:id', questionController.remove);

/*
 * PUT
 */
router.put('/:id', questionController.update);

/*
 * DELETE
 */
router.delete('/:id', questionController.remove);
//router.delete('/:id/:uname',questionController.removeSafe);

module.exports = router;
