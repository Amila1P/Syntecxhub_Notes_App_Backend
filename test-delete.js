const express = require('express');
const app = express();

app.delete('/:id', (req, res) => {
    res.json({ msg: 'Delete worked!', id: req.params.id });
});

app.listen(3001, () => {
    console.log('Test server running on :3001');
});
