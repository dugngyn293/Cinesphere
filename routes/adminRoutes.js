const express = require('express');
const router = express.Router();
const adminRepo = require('../repositories/admin');
const adminService = require('../repositories/admin');


router.get('/admin/users', async (req, res) => {
    try {
        const users = await adminRepo.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error('Admin query error:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
router.delete('/admin/delete-user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const success = await adminRepo.deleteUserById(userId);
        if (success) {
            res.json({ success: true, message: 'User deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/reset-password/:userId', async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (typeof newPassword !== 'string' || newPassword.trim() === '') {
        return res.status(400).json({ success: false, message: 'Password cannot be empty.' });
    }

    try {
        const success = await adminService.updatePasswordByUserId(userId, newPassword);
        if (success) {
            res.json({ success: true, message: 'Password updated successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'User not found.' });
        }
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});



module.exports = router;
