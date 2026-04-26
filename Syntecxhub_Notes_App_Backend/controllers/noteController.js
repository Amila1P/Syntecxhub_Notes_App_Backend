const Note = require('../models/note');

// 1. Create Note
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        console.log("Creating note - User:", req.user, "Title:", title);
        
        const newNote = new Note({ title, content, user: req.user });
        const note = await newNote.save();
        
        console.log("Note created successfully:", note._id, "User:", note.user);
        res.json(note);
    } catch (err) {
        console.error("CreateNote Error:", err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
};

// 2. Get All Notes (with Populate)
exports.getNotes = async (req, res) => {
    try {
        console.log("getNotes request - User:", req.user);
        
        const notes = await Note.find({ user: req.user })
            .populate('user', ['name', 'email']) 
            .sort({ createdAt: -1 });
        
        console.log("Found", notes.length, "notes for user:", req.user);
        notes.forEach(n => console.log("- ", n.title, "isArchived:", n.isArchived));
        
        res.json(notes);
    } catch (err) {
        console.error("getNotes Error:", err.message);
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
        console.log("Archive request - ID:", req.params.id, "User:", req.user);
        
        let note = await Note.findById(req.params.id);

        if (!note) {
            console.log("Note not found");
            return res.status(404).json({ msg: 'Note not found' });
        }

        if (note.user.toString() !== req.user) {
            console.log("Not authorized - Note user:", note.user, "Request user:", req.user);
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Archive the note (soft-delete)
        note.isArchived = true;
        await note.save();
        
        console.log("Note archived successfully:", note._id, "isArchived:", note.isArchived);
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

// Permanent Delete a note
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        if (note.user.toString() !== req.user) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Note.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Note deleted permanently' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};