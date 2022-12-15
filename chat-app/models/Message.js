const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Message', MessageSchema);