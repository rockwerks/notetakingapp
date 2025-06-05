const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: String,
    displayName: String,
    email: String,
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)