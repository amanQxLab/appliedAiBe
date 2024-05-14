const express = require('express');
const router = express.Router();
const authorize = require("../middleware/authorize")
// ngrok http http://localhost:8000
/*******************************************************************
 * @Purpose: All routeres related to the User Controller
*******************************************************************/
const controller = require('../controllers/roles');

router.post('/', authorize, controller.post);
router.get("/", authorize, controller.list);
router.put('/:_id', authorize, controller.put);
router.get("/:_id", authorize, controller.get);
router.delete("/:_id", authorize, controller.delete);

module.exports = router;
