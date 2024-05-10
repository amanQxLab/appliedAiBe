const mongoose = require('mongoose');
const { config } = require("../config/config.js");

mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

const mongoDB= mongoose.connection;


module.exports =  mongoDB;
