var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

/*
 * GET
 */
//router.get('/', userController.list);
router.get('/index',userController.indexPage);
router.get('/login', userController.showLogin);
router.get('/register', userController.showRegister);
router.get('/profile', userController.profile);
router.get('/market', userController.showMarket);
router.get('/send', userController.sendShow);
router.get('/receive',userController.receiveShow);
router.get('/logout', userController.logout);
router.get('/transaction', userController.testTransaction);


//router.get('/:id', userController.show);


/*
 * POST
 */
router.post('/', userController.create);
router.post('/login', userController.login);
router.post('/logout', userController.logout);




/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
