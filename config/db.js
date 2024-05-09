const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/appliedAI', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

const mongoDB= mongoose.connection;


module.exports =  mongoDB;
