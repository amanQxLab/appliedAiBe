const mongoose = require('mongoose');

// MongoDB connection
// mongodb://localhost:27017/appliedAI
// mongodb+srv://krishna:sqsHfVgEVNN94pB0@cluster0.ldct9pt.mongodb.net/aiappdb?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect('mongodb://localhost:27017/appliedAI', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

const mongoDB= mongoose.connection;


module.exports =  mongoDB;
