const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const adminPool = mysql.createPool({
    host: '127.0.0.1',
    user: 'admin',
    password: 'cinesphere',
    database: 'cinesphere',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get all users
async function getAllUsers() {
    try {
        const [rows] = await adminPool.query('SELECT * FROM users');
        return rows;
    } catch (err) {
        console.error('Error in getAllUsers:', err);
        throw err;
    }
}

// Delete user by ID
async function deleteUserById(userId) {
    try {
        console.log(`Attempting to delete user with ID: ${userId}`);

        const parsedId = parseInt(userId, 10);
        if (isNaN(parsedId)) {
            throw new Error('Invalid user ID');
        }

        const [result] = await adminPool.query('DELETE FROM users WHERE id = ?', [parsedId]);
        console.log('Delete query result:', result);

        return result.affectedRows > 0;
    } catch (err) {
        console.error(`Error in deleteUserById for ID ${userId}:`, err);
        throw err;
    }
}

// Update password by username
async function updatePasswordByUsername(username, newPassword) {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [result] = await adminPool.query(
            'UPDATE users SET password = ? WHERE username = ?',
            [hashedPassword, username]
        );

        console.log('Update password result:', result);

        return result.affectedRows > 0;
    } catch (err) {
        console.error(`Error in updatePasswordByUsername for ${username}:`, err);
        throw err;
    }
}

//update password for admin
async function updatePasswordByUserId(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await adminPool.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
    );

    return result.affectedRows > 0;
}


module.exports = {
    getAllUsers,
    deleteUserById,
    updatePasswordByUsername,
    updatePasswordByUserId
};
