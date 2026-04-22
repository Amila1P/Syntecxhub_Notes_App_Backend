const Note = require('../models/Note');

// 1. Create Note
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = new Note({ title, content, user: req.user });
        const note = await newNote.save();
        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 2. Get All Notes (with Populate)
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user, isArchived: false })
            .populate('user', ['name', 'email']) 
            .sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 3. Archive Note (Soft-delete)
exports.archiveNote = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        if (note.user.toString() !== req.user) { 
            return res.status(401).json({ msg: 'Not authorized' });
        }

        note.isArchived = true; // Soft-delete logic
        await note.save();
        res.json({ msg: 'Note archived successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};