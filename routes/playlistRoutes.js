const express = require('express');
const router = express.Router();
const playlistRepo = require('../repositories/playlistRepo');

// ✅ middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
}

// ✅ get playlist of current user
router.get('/my', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const playlist = await playlistRepo.getUserPlaylists(userId);
        res.json({ playlist });
    } catch (error) {
        console.error('🎬 Error fetching playlist:', error);
        res.status(500).json({ message: 'Failed to fetch playlist' });
    }
});

// ✅ add movie to playlist
router.post('/add', ensureAuthenticated, async (req, res) => {
    const userId = req.session.user.id;
    const { id, title, poster, year, rating } = req.body;

    if (!userId || !id || !title || !poster || !year) {
        return res.status(400).json({ message: "Missing required movie fields" });
    }

    try {
        await playlistRepo.addMovie(userId, id, title, poster, year, rating ?? 0);
        res.json({ success: true });
    } catch (err) {
        if (err.message === 'DUPLICATE_MOVIE') {
            return res.status(409).json({ message: "Movie already in playlist" });
        }
        console.error("❌ Error in /playlist/add:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ delete movie from playlist
router.delete('/remove/:movieId', ensureAuthenticated, async (req, res) => {
    const userId = req.session.user.id;
    const movieId = parseInt(req.params.movieId, 10);

    console.log('🧹 Attempting to remove:', { userId, movieId });

    try {
        const result = await playlistRepo.removeMovie(userId, movieId);

        if (result?.affectedRows === 0) {
            return res.status(404).json({ message: 'Not found or already removed' });
        }

        res.json({ message: 'Removed from playlist' });
    } catch (error) {
        console.error('🎬 Error removing movie:', error);
        res.status(500).json({ message: 'Failed to remove movie' });
    }
});


module.exports = router;
