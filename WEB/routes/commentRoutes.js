var express = require('express');
var router = express.Router();
var commentController = require('../controllers/commentController.js');

/*
 * GET
 */
router.get('/', commentController.list);

/*
 * GET
 */
//router.get('/:id', commentController.show);
//router.get('/:id', commentController.listSpecific);
router.get('/:q_id', commentController.listSpecific);
router.get('/c/:q_id', commentController.listSpecific2);
router.get('/:own/:q_id', commentController.listSpecific3);
router.get('/c/:own/:q_id', commentController.listSpecific4);

//router.get('/sel/:c_id',commentController.update);

/*
 * POST
 */
router.post('/', commentController.create);
router.post('/sel/:c_id',commentController.update);
router.post('/del/:id', commentController.remove);
router.post('/user', commentController.listSpecificUser);

/*
 * PUT
 */
router.put('/:id', commentController.update);

/*
 * DELETE
 */
router.delete('/:id', commentController.remove);

module.exports = router;
