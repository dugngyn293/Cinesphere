const express = require('express');
const router = express.Router();
const playlistRepo = require('../repositories/playlistRepo');

// ✅ Middleware kiểm tra đăng nhập
function ensureAuthenticated(req, res, next) {
    if ((req.isAuthenticated && req.isAuthenticated()) || (req.session && req.session.user)) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
}

// ✅ get playlist of current user
router.get('/my', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const playlists = await playlistRepo.getUserPlaylists(userId);
        res.json({ playlists });
    } catch (error) {
        console.error('🎬 Error fetching playlist:', error);
        res.status(500).json({ message: 'Failed to fetch playlist' });
    }
});

// ✅ add movie to playlist
router.post('/add', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { id, title, poster, year, rating } = req.body;

        if (!userId || !id || !title || !poster || !year) {
            return res.status(400).json({ message: "Missing required movie fields" });
        }

        await playlistRepo.addMovie(userId, id, title, poster, year, rating || 0);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Error in /playlist/add:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ delete movie from playlist
router.delete('/remove/:movieId', ensureAuthenticated, async (req, res) => {
    try {
        await playlistRepo.removeMovie(req.session.user.id, req.params.movieId);
        res.json({ message: 'Removed from playlist' });
    } catch (error) {
        console.error('🎬 Error removing movie:', error);
        res.status(500).json({ message: 'Failed to remove movie' });
    }
});

module.exports = router;
