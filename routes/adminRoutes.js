const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const adminRepo = require('../repositories/admin');

// Middleware nội tuyến để kiểm tra admin
function checkAdmin(req, res, next) {
    const user = req.session?.user;
    if (user && user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied: Admin only' });
}

// Fetch all users (Admin only)
router.get('/admin/users', checkAdmin, async (req, res) => {
    try {
        const users = await adminRepo.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error('Admin query error:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Delete user by ID (Admin only)
router.delete('/admin/delete-user/:id', checkAdmin, async (req, res) => {
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

// Reset password for a user (Admin only)
router.post('/reset-password/:userId', checkAdmin, async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (typeof newPassword !== 'string' || newPassword.trim() === '') {
        return res.status(400).json({ success: false, message: 'Password cannot be empty.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const success = await adminRepo.updatePasswordByUserId(userId, hashedPassword);

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
