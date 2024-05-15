const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        fName: {
            type: String,
            default: ''
        },
        lName: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: '',
            required: true,
            unique: true
        },
        thirdPartyLogin: {
            googleId: {
                type: String,
                default: ''
            }
        },
        verified: {
            type: Boolean,
            default: false
        },
        status: {
            type: Boolean,
            default: true
        },
        password:{
            type: String,
            default: ''
        },
        userType:{
            type: String,
            enum: ['Personal', 'Organisation'],
            default: 'Personal'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
