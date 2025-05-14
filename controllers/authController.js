// controllers/authController.js
const { validationResult } = require('express-validator');
const User = require('../repositories/userRepo.js'); // Assuming you have a user repository
const bcrypt = require('bcryptjs'); // For password hashing
const crypto = require('crypto'); // Needed for reset token generation/hashing


exports.registerUser = async (req, res, next) => {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Check if user already exists by email or username
        let existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use.' });
        }
        existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(409).json({ message: 'Username already taken.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            // role will default to 'user' as per schema
        });

        // Generate JWT token
        const payload = {
            user: {
                id: newUser.id, // Assuming User.create returns the created user with id
                username: newUser.username,
                role: newUser.role || 'user' // Ensure role is included
            },
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN },
            (err, token) => {
                if (err) throw err;
                // Return user info (excluding password) and token
                res.status(201).json({
                    token,
                    user: {
                        id: newUser.id,
                        username: newUser.username,
                        email: newUser.email,
                        role: newUser.role || 'user'
                    }
                });
            }
        );
    } catch (error) {
        console.error('Error in registerUser:', error.message);
        next(error); // Pass error to the global error handler
    }
};

exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials (email not found).' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials (password incorrect).' });
        }

        // User matched, create JWT payload
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            },
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN },
            (err, token) => {
                if (err) throw err;
                // Return user info (excluding password) and token
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email, // Make sure to select email in findByEmail if needed here
                        role: user.role
                    }
                });
            }
        );
    } catch (error) {
        console.error('Error in loginUser:', error.message);
        next(error);
    }
};

// Logout User
exports.logoutUser = (req, res) => {
    // For stateless JWT, logout is primarily a client-side task: the client discards the token.
    // If you implement a server-side token denylist, you would add the token to it here.
    res.json({ message: 'Logout successful. Please discard your token on the client-side.' });
};

// Request Password Reset - Step 1
exports.requestPasswordReset = async (req, res, next) => {
    // Assumes email validation is done in the route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (user) {
            // Generate the original token (sent to user)
            const resetToken = crypto.randomBytes(32).toString('hex');

            // Hash the token (stored in DB)
            // Use crypto.createHash for consistency if bcrypt isn't desired for this
            const hashedResetToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');

            // Calculate expiry time
            const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000);

            // Save hashed token and expiry to user record
            await User.savePasswordResetToken(user.id, hashedResetToken, expiresAt);

            // Construct the reset URL (using the *original* token)
            // Adapt the base URL to your frontend application's reset page
            const resetUrl = `${process.env.FRONTEND_URL || req.protocol + '://' + req.get('host')}/reset-password?token=${resetToken}`;

            // Simulate sending email (replace with actual email sending logic)
            console.log('---- PASSWORD RESET EMAIL SIMULATION ----');
            console.log(`To: ${user.email}`);
            console.log(`Subject: Password Reset Request`);
            console.log(`Body: Click this link to reset your password (valid for ${PASSWORD_RESET_TOKEN_EXPIRES_MINUTES} mins): ${resetUrl}`);
            console.log('-----------------------------------------');
        }

        // Important: Always send a generic success message regardless of whether the user was found
        res.status(200).json({ 
            message: `If your email (${email}) is registered with us, you will receive instructions to reset your password.` 
        });

    } catch (error) {
        console.error('Error in requestPasswordReset:', error.message);
        // Generic message even on internal error during reset request phase
        res.status(200).json({ 
            message: `If your email (${email}) is registered with us, you will receive instructions to reset your password.` 
        }); 
    }
};

// Reset Password - Step 2
exports.resetPassword = async (req, res, next) => {
    // Get the original token from the request (e.g., URL param or body)
    const { token } = req.body; // Assuming token sent in body for POST
    const { password } = req.body; // New password

    // Add password validation in the route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!token) {
        return res.status(400).json({ message: 'Password reset token is required.' });
    }

    try {
        // 1. Hash the incoming token to match the one stored in the DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // 2. Find the user by the hashed token
        const user = await User.findUserByHashedPasswordResetToken(hashedToken);

        // 3. Check if user exists and token is not expired
        if (!user || !user.password_reset_expires || user.password_reset_expires < new Date()) {
            // If token invalid or expired, clear it for the potentially found user (if any)
            if (user) {
                await User.clearPasswordResetToken(user.id);
            }
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // 4. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Update the user's password
        await User.updateUserPassword(user.id, hashedPassword);

        // 6. Clear the reset token fields now that it's used
        await User.clearPasswordResetToken(user.id);

        // Optional: Log the user in by generating a new JWT, or just confirm success
        res.json({ message: 'Password has been reset successfully. You can now login.' });

    } catch (error) {
        console.error('Error in resetPassword:', error.message);
        next(error);
    }
};

