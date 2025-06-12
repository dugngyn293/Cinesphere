const { pool } = require('../database/pool');

module.exports = {
    async getUserPlaylists(userId) {
        const [rows] = await pool.query("SELECT * FROM playlist_items WHERE user_id = ?", [userId]);
        return rows;
    },

    async addMovie(userId, movieId, title, poster, year, rating) {
        await pool.query(
            "INSERT INTO playlist_items (user_id, movie_id, title, poster, year, rating) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, movieId, title, poster, year, rating]
        );
    },

    async removeMovie(userId, movieId) {
        await pool.query("DELETE FROM playlist_items WHERE user_id = ? AND movie_id = ?", [userId, movieId]);
    }
};
