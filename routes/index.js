
const express = require('express');
const router = express.Router();
const userRouter = require('./user'),
    roleRouter = require('./roles');

router.use('/user', userRouter);
router.use('/roles', roleRouter);

module.exports = router;
