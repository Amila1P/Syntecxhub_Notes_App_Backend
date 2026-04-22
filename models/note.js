const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },

    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    isArchived: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);