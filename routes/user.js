const express = require('express');
const router = express.Router();


/*******************************************************************
 * @Purpose: All routeres related to the User Controller
*******************************************************************/
const userController = require('../controllers/user');

router.post('/login', userController.login);


module.exports = router;
