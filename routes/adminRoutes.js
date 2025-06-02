const express = require('express');
const router = express.Router();
const adminRepo = require('../repositories/admin');

router.get('/admin/users', async (req, res) => {
    try {
        const users = await adminRepo.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error('Admin query error:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
