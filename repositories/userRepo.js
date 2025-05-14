import { pool } from '../database/pool.js';

// Function to find a user by their email address
export const findByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    try {
        const [rows] = await pool.query(query, [email]); // 
        return rows[0];
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
    };


// Function to find a user by their username
export const findByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  try {
    const [rows] = await pool.query(query, [username]);
    return rows[0]; // Returns the user object or undefined if not found
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  }
};

// Function to create a new user
export const create = async (userData) => {
  const { username, email, password } = userData;

  const query = `
    INSERT INTO users (username, email, password) 
    VALUES (?, ?, ?);
  `
  
  try {
    const [results] = await pool.query(query, [username, email, password]);
    // Return an object with the new user's ID and the data provided
    return { id: results.insertId, ...userData }; 
  } catch (error) {
    console.error('Error creating user:', error);
    // Handle potential erors (e.g., duplicate email/username)
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('Duplicate entry for username or email.');
    }
    throw error;
  }
};

// Function to find a user by their ID
export const findById = async (id) => {
  const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = ?'; // Exclude password
  try {
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
};

// Function to update user data (excluding password, handle password separately in controller/service)
export const update = async (id, userData) => {
  // Construct SET clause dynamically based on userData keys
  // Example: Only updates email and username. Adapt for other fields.
  const fieldsToUpdate = {};
  if (userData.email) fieldsToUpdate.email = userData.email;
  if (userData.username) fieldsToUpdate.username = userData.username;
  // Add other updatable fields here, e.g., bio, profile_picture_url, etc.

  if (Object.keys(fieldsToUpdate).length === 0) {
    return { affectedRows: 0, message: 'No fields to update' };
  }

  const setClause = Object.keys(fieldsToUpdate).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(fieldsToUpdate), id];

  const query = `UPDATE users SET ${setClause} WHERE id = ?`;
  try {
    const [results] = await pool.query(query, values);
    return { affectedRows: results.affectedRows }; // Returns how many rows were changed
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('Update failed due to duplicate username or email.');
    }
    throw error;
  }
};

// Function to delete a user by ID
export const deleteUser = async (id) => {
  const query = 'DELETE FROM users WHERE id = ?';
  try {
    const [results] = await pool.query(query, [id]);
    return { affectedRows: results.affectedRows }; // Returns 1 if deleted, 0 if not found
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// --- User-Movie Relationship Functions (user_movie table) ---

// Function to find all movie IDs associated with a user
export const findUserMovies = async (userId) => {
  const query = 'SELECT movie_id FROM user_movie WHERE user_id = ?';
  try {
    const [rows] = await pool.query(query, [userId]);
    return rows.map(row => row.movie_id); // Returns an array of movie_ids
  } catch (error) {
    console.error('Error finding user movies:', error);
    throw error;
  }
};

// Function to add a movie to a user's list
export const addUserMovie = async (userId, movieId) => {
  const query = 'INSERT INTO user_movie (user_id, movie_id) VALUES (?, ?)';
  try {
    const [results] = await pool.query(query, [userId, movieId]);
    return { insertId: results.insertId, affectedRows: results.affectedRows };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Already exists, not necessarily an error for this operation
      return { affectedRows: 0, message: 'Movie already in user list' };
    }
    console.error('Error adding user movie:', error);
    throw error;
  }
};

// Function to remove a movie from a user's list
export const removeUserMovie = async (userId, movieId) => {
  const query = 'DELETE FROM user_movie WHERE user_id = ? AND movie_id = ?';
  try {
    const [results] = await pool.query(query, [userId, movieId]);
    return { affectedRows: results.affectedRows };
  } catch (error) {
    console.error('Error removing user movie:', error);
    throw error;
  }
};

// Function to check if a movie is in a user's list
export const checkUserMovie = async (userId, movieId) => {
  const query = 'SELECT 1 FROM user_movie WHERE user_id = ? AND movie_id = ? LIMIT 1';
  try {
    const [rows] = await pool.query(query, [userId, movieId]);
    return rows.length > 0; // True if exists, false otherwise
  } catch (error) {
    console.error('Error checking user movie:', error);
    throw error;
  }
};

// --- User-Achievement Relationship Functions (user_achievements table) ---

// Function to find all achievement IDs earned by a user
export const findUserAchievements = async (userId) => {
  const query = 'SELECT achievement_id FROM user_achievements WHERE user_id = ? ORDER BY achieved_at DESC';
  try {
    const [rows] = await pool.query(query, [userId]);
    return rows.map(row => row.achievement_id); // Returns an array of achievement_ids
  } catch (error) {
    console.error('Error finding user achievements:', error);
    throw error;
  }
};

// Function to add an achievement to a user
export const addUserAchievement = async (userId, achievementId) => {
  // achieved_at defaults to CURRENT_TIMESTAMP in schema
  const query = 'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)';
  try {
    const [results] = await pool.query(query, [userId, achievementId]);
    return { insertId: results.insertId, affectedRows: results.affectedRows };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // User already has this achievement
      return { affectedRows: 0, message: 'User already has this achievement' };
    }
    console.error('Error adding user achievement:', error);
    throw error;
  }
};

// Function to save password reset token details for a user
export const savePasswordResetToken = async (userId, hashedToken, expiresAt) => {
  const query = 'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?';
  try {
    const [results] = await pool.query(query, [hashedToken, expiresAt, userId]);
    return results.affectedRows > 0;
  } catch (error) {
    console.error('Error saving password reset token:', error);
    throw error;
  }
};

// Function to find a user by a hashed password reset token (and check expiry in controller)
export const findUserByHashedPasswordResetToken = async (hashedToken) => {
  const query = 'SELECT * FROM users WHERE password_reset_token = ?';
  try {
    const [rows] = await pool.query(query, [hashedToken]);
    return rows[0]; // Returns user or undefined
  } catch (error) {
    console.error('Error finding user by reset token:', error);
    throw error;
  }
};

// Function to clear password reset token details for a user (e.g., after successful reset or expiry)
export const clearPasswordResetToken = async (userId) => {
  const query = 'UPDATE users SET password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?';
  try {
    const [results] = await pool.query(query, [userId]);
    return results.affectedRows > 0;
  } catch (error) {
    console.error('Error clearing password reset token:', error);
    throw error;
  }
};

// Function to update only the password (used after reset or for normal password change)
export const updateUserPassword = async (userId, hashedPassword) => {
  const query = 'UPDATE users SET password = ? WHERE id = ?';
  try {
    const [results] = await pool.query(query, [hashedPassword, userId]);
    return results.affectedRows > 0;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};

