const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ['work', 'personal', 'ideas', 'todos', 'other'],
        default: 'personal'
    },
    owner: String, 
    createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema)

module.exports = mongoose.model('Note', noteSchema)