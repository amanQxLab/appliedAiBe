const UserModel = require('../models/user');
const {validationData} = require("../utility/function")

module.exports.login = (req, res) => {
    return res.send({message: "login failed!",status: 'failure', data: []});
}