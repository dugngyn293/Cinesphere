const { pool } = require('../database/pool');

module.exports = {
    async getUserPlaylists(userId) {
        const [rows] = await pool.query("SELECT * FROM playlist_items WHERE user_id = ?", [userId]);
        return rows;
    },

    async addMovie(userId, movieId, title, poster, year, rating) {
        // Check if movie already exists for this user
        const [existing] = await pool.query(
            "SELECT * FROM playlist_items WHERE user_id = ? AND movie_id = ?",
            [userId, movieId]
        );

        if (existing.length > 0) {
            // Movie already exists — skip insert
            throw new Error('DUPLICATE_MOVIE');
        }

        await pool.query(
            "INSERT INTO playlist_items (user_id, movie_id, title, poster, year, rating) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, movieId, title, poster, year, rating]
        );
    },


    async removeMovie(userId, movieId) {
        console.log("🔥 SQL DELETE movie_id:", movieId, typeof movieId);
        await pool.query(
            'DELETE FROM playlist_items WHERE user_id = ? AND movie_id = ?',
            [userId, movieId]
        );
    }


};
