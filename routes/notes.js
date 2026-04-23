const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const noteController = require('../controllers/noteController');

console.log('Routes - noteController.unarchiveNote:', typeof noteController.unarchiveNote);

// 1. Create a note
router.post('/', auth, noteController.createNote);

// 2. Get all notes (with populate)
router.get('/', auth, noteController.getNotes);

// 3. Archive a note (specific routes MUST come before generic :id route)
router.put('/archive/:id', auth, noteController.archiveNote);

// 4. Unarchive a note
router.put('/unarchive/:id', auth, noteController.unarchiveNote);

// 5. Update a note (generic route - MUST be last)
router.put('/:id', auth, noteController.updateNote); 

module.exports = router;