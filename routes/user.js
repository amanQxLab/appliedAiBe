const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize")
// ngrok http http://localhost:8000
/*******************************************************************
 * @Purpose: All routeres related to the User Controller
*******************************************************************/
const userController = require('../controllers/user');

router.post('/login', userController.login);
router.post('/signup', userController.signup)
router.get("/refreshAccessToken", userController.refreshAccessToken);
router.get("/home", authorize, userController.homeHandler);
router.post(`/password/forgot`, userController.forgotPassword);
router.post(`/password/reset`, userController.resetPassword);

module.exports = router;
