const express = require('express');
const router = express.Router();
const ratingRepo = require('../repositories/ratingRepo');

// ✅ Middleware to check if user is logged in
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
}

// ✅ Route to submit or update a movie rating
router.post('/rate', ensureAuthenticated, async (req, res) => {
    const userId = req.session.user.id;
    const { movieId, rating, title, poster, year } = req.body;
    console.log("📥 Incoming rating:", { userId, movieId, rating, title, poster, year });

    if (!userId || !movieId || typeof rating !== 'number') {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        await ratingRepo.rateMovie(userId, movieId, rating, title, poster, year);
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Error rating movie:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// ✅ Route: get all rated movies of current user
router.get('/my', ensureAuthenticated, async (req, res) => {
    const userId = req.session.user.id;

    try {
        const movies = await ratingRepo.getUserRatings(userId);
        res.json({ ratings: movies });
    } catch (err) {
        console.error('❌ Failed to fetch ratings:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ✅ Route: delete a rating by movieId for current user
router.delete('/delete/:movieId', ensureAuthenticated, async (req, res) => {
    const userId = req.session.user.id;
    const movieId = req.params.movieId;

    if (!movieId) {
        return res.status(400).json({ message: "Missing movieId" });
    }

    try {
        await ratingRepo.deleteRating(userId, movieId);
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Failed to delete rating:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
