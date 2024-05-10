const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            default: ''
        },
        refreshToken: {
            type: String,
            default: ''
        },
        status: {
            type: Boolean,
            default: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Token', TokenSchema);
