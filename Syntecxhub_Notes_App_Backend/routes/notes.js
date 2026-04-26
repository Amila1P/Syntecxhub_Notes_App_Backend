const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const noteController = require('../controllers/noteController');

// 1. Create a note
router.post('/', auth, noteController.createNote);

// 2. Get all notes (with populate)
router.get('/', auth, noteController.getNotes);

// 3. DELETE - MUST be before generic :id routes
router.delete('/:id', auth, noteController.deleteNote);

// 4. Archive a note
router.put('/archive/:id', auth, noteController.archiveNote);

// 5. Unarchive a note
router.put('/unarchive/:id', auth, noteController.unarchiveNote);

// 6. Update a note (generic route - MUST be last)
router.put('/:id', auth, noteController.updateNote);

module.exports = router;