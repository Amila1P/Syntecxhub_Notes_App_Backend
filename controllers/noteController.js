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

// 3. Update Note
exports.updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        let note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ msg: 'Note not found' });

        if (note.user.toString() !== req.user) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 4. Archive Note (Soft-delete)
exports.archiveNote = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        if (note.user.toString() !== req.user) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // 3. Archive the note (soft-delete)
        note.isArchived = true;
        await note.save();

        res.json({ msg: 'Note archived successfully', note });
    } catch (err) {
        console.error("Archive Error:", err.message); 
        res.status(500).send('Server Error: ' + err.message);
    }
};

// Unarchive a note
exports.unarchiveNote = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        if (!note) return res.status(404).json({ msg: 'Note not found' });

        if (note.user.toString() !== req.user) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        note.isArchived = false;
        await note.save();

        res.json({ msg: 'Note unarchived successfully', note });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};