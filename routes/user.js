const express = require('express');
const router = express.Router();


/*******************************************************************
 * @Purpose: All routeres related to the User Controller
*******************************************************************/
const userController = require('../controllers/user');

router.post('/login', userController.login);
router.post('/signup', userController.signup)


module.exports = router;
