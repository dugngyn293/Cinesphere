const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { updateUserProfile, updateUserPassword } = require('../repositories/userRepo');
const playlistRepo = require('../repositories/playlistRepo');
const bcrypt = require('bcrypt');


// Setup multer storage for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

router.put('/user/password', async (req, res) => {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
        return res.status(400).json({ success: false, message: 'Username and new password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateUserPassword(username, hashedPassword);
        res.json({ success: true, message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Failed to update password.' });
    }
});

// This is the older, buggier version you wanted to revert to.
router.post('/update-profile', upload.single('avatar'), async (req, res) => {
  const { username, password } = req.body;
  const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // This version doesn't use the session and requires a username in the body.
    await updateUserProfile(username, { password, avatarUrl });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      avatarUrl: avatarUrl
    });
  } catch (err) {
    console.error('❌ Error in update-profile:', err);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    });
  }
});

// --- Playlist Routes ---

// GET all playlists for the logged-in user
router.get('/playlists', async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: 'You must be logged in to view playlists.' });
    }
    try {
        const playlists = await playlistRepo.getPlaylistsByUserId(req.user.id);
        res.json(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ message: 'Failed to retrieve playlists.' });
    }
});

// POST a new playlist
router.post('/playlists', async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'Playlist name is required.' });
    }
    try {
        const newPlaylist = await playlistRepo.createPlaylist(req.user.id, name);
        res.status(201).json(newPlaylist);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'A playlist with that name already exists.' });
        }
        console.error('Error creating playlist:', error);
        res.status(500).json({ message: 'Failed to create playlist.' });
    }
});

// DELETE a playlist
router.delete('/playlists/:playlistId', async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { playlistId } = req.params;
    try {
        const result = await playlistRepo.deletePlaylist(req.user.id, playlistId);
        if (result.status === 'success') {
            res.status(204).send(); // No content
        } else if (result.status === 'not_found') {
            res.status(404).json({ message: 'Playlist not found.' });
        } else {
            res.status(403).json({ message: 'You do not have permission to delete this playlist.' });
        }
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({ message: 'Failed to delete playlist.' });
    }
});


// POST a movie to a playlist
router.post('/playlists/:playlistId/movies', async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { playlistId } = req.params;
    const movieDetails = req.body; // e.g., { external_id, title, ... }

    try {
        const result = await playlistRepo.addMovieToPlaylist(req.user.id, playlistId, movieDetails);
        if (result.status === 'success') {
            res.status(201).json({ message: 'Movie added successfully.' });
        } else {
            res.status(result.status === 'unauthorized' ? 403 : 404).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error adding movie to playlist:', error);
        res.status(500).json({ message: 'Failed to add movie.' });
    }
});

// DELETE a movie from a playlist
router.delete('/playlists/:playlistId/movies/:movieId', async (req, res) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { playlistId, movieId } = req.params;
    try {
        const result = await playlistRepo.removeMovieFromPlaylist(req.user.id, playlistId, movieId);
        if (result.status === 'success') {
            res.status(204).send();
        } else {
            res.status(result.status === 'unauthorized' ? 403 : 404).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error removing movie:', error);
        res.status(500).json({ message: 'Failed to remove movie.' });
    }
});

module.exports = router;
