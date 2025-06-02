const mysql = require('mysql2/promise');

const adminPool = mysql.createPool({
    host: '127.0.0.1',
    user: 'admin',
    password: 'cinesphere',
    database: 'cinesphere'
});

async function getAllUsers() {
    const [rows] = await adminPool.query('SELECT * FROM users');
    return rows;
}

module.exports = {
    getAllUsers
};
