const { pool } = require('../database/pool');

module.exports = {
    async rateMovie(userId, movieId, rating, title, poster, year) {
        await pool.query(
            `INSERT INTO ratings (user_id, movie_id, rating, title, poster, year)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                rating = VALUES(rating),
                title = VALUES(title),
                poster = VALUES(poster),
                year = VALUES(year),
                rated_at = CURRENT_TIMESTAMP`,
            [userId, movieId, rating, title, poster, year]
        );
    },


    async getUserRatings(userId) {
        const [rows] = await pool.query(
            `SELECT movie_id, rating, title, poster, year
             FROM ratings
             WHERE user_id = ?`,
            [userId]
        );
        return rows;
    },


    async deleteRating(userId, movieId) {
        await pool.query(
            'DELETE FROM ratings WHERE user_id = ? AND movie_id = ?',
            [userId, movieId]
        );
    }


};
