const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const noteController = require('../controllers/noteController');

// 1. Create a note
router.post('/', auth, noteController.createNote);

// 2. Get all notes (with populate)
router.get('/', auth, noteController.getNotes);

// 3. Archive a note (Soft-delete)
router.put('/archive/:id', auth, noteController.archiveNote);

// 4. Update a note
router.put('/:id', auth, noteController.updateNote); 

module.exports = router;