var createError = require('http-errors');
var express = require('express');
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
var path = require('path');
const fetch = require('node-fetch');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const UserRepo = require('./repositories/userRepo.js'); // Import user repository
const bcrypt = require('bcrypt');
const adminRoutes = require('./routes/adminRoutes');
const adminRepo = require('./repositories/admin.js');
const cors = require('cors');
const { rateLimiter } = require('./middleware/rateLimiter');
const playlistRoutes = require('./routes/playlistRoutes');
const ratingRoutes = require('./routes/ratingRoutes');



// In-memory rating caches (until DB layer wired)
const movieRatings = {};
const userVotes = {};

dotenv.config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var authRouter = require('./routes/auth');

var app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));





app.use('/admin', adminRoutes);
app.use('/users', usersRouter);
app.use('/api', rateLimiter, usersRouter);
app.use('/api/playlist', playlistRoutes);
app.use('/api/ratings', ratingRoutes);

// app.use('/api', authRouter);
app.use('/', adminRoutes);
function ensureAuthenticated(req, res, next) {
  if ((req.isAuthenticated && req.isAuthenticated()) || req.session.user) {
    return next();
  }
  res.redirect('/auth.html');
}
function ensureAdminHtml(req, res, next) {
  const user = req.session && req.session.user;
  if (user && user.role === 'admin') {
    return next();
  }
  return res.redirect('/auth.html');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("✅ Google OAuth callback triggered");
        console.log("🌐 Google profile:", profile);

        const googleId = profile.id;
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        const displayName = profile.displayName;
        const profileImageUrl = profile.photos && profile.photos[0] && profile.photos[0].value;

        if (!email) {
          console.log("❌ Email not returned from Google profile");
          return done(new Error("Email not provided by Google"), null);
        }

        let user = await UserRepo.findByGoogleId(googleId);
        console.log("🔍 Lookup by Google ID:", user);

        if (!user) {
          user = await UserRepo.findByEmail(email);
          console.log("📧 Lookup by Email:", user);
        }

        if (!user) {
          console.log("🆕 Creating new user...");
          const newUser = {
            google_id: googleId,
            email: email,
            username: displayName,
            profile_image_url: profileImageUrl,
            role: 'user'
          };

          user = await UserRepo.create(newUser);
          console.log("✅ Created new user:", user);
        }

        console.log("🎉 Finished Google auth. User:", user);
        return done(null, user);

      } catch (err) {
        console.error("❌ Error during Google auth:", err);
        return done(err, null);
      }
    }
  )
);



passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user by their database ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserRepo.findById(id); // Fetch user by ID from database
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth.html' }),
  (req, res) => {
    const user = req.user;
    console.log("🔄 Callback received. Session user:", user);

    if (!user.role) {
      console.log("ℹ️ No role found, assigning default 'user'");
      user.role = 'user';
    }

    req.session.user = user;
    req.session.save(() => {
      const username = user.username || user.email.split('@')[0];
      const avatar = user.profile_image_url || '';
      console.log("✅ Redirecting to index.html with:", { username, avatar });
      res.redirect(`/index.html?username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}`);
    });
  }
);



app.get("/api/discover-tv", async (req, res) => {
  const genres = req.query.genres;
  const apiKey = process.env.TMDB_API_KEY;

  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?with_genres=${genres}&api_key=${apiKey}`);
    const data = await response.json();
    res.json({ results: data.results });
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    res.status(500).json({ error: "Failed to fetch TV shows." });
  }
});


app.get("/api/user", (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });

  const user = {
    displayName: req.user.displayName || req.user.username,
    email: req.user.email || (req.user.emails?.[0]?.value),
    photo: req.user.profile_image_url || (req.user.photos?.[0]?.value),
  };
  res.json({ user });
});



app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth.html");
  });
});



app.get("/api/search", async (req, res) => {
  const query = req.query.query;
  const apiKey = process.env.TMDB_API_KEY;

  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
    );

    const data = await tmdbRes.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching from TMDB:", err);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

app.get('/api/trailer', async (req, res) => {
  const id = req.query.id;
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`);
    const data = await tmdbRes.json();
    const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    res.json({ trailerUrl });
  } catch (err) {
    console.error("Trailer error:", err);
    res.status(500).json({ error: "Failed to fetch trailer" });
  }
});

app.get('/api/rating', (req, res) => {
  const movieId = req.query.movieId;
  const rating = movieRatings[movieId] || { total: 0, votes: 0 };
  const average = rating.votes ? rating.total / rating.votes : 0;
  res.json({ average, votes: rating.votes });
});


app.post('/api/rate', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });

  const email = req.user.emails?.[0]?.value;
  const { movieId, rating } = req.body;

  if (!userVotes[email]) userVotes[email] = {};
  if (userVotes[email][movieId] != null) {
    return res.status(400).json({ error: 'You already voted for this movie.' });
  }

  userVotes[email][movieId] = rating;

  if (!movieRatings[movieId]) movieRatings[movieId] = { total: 0, votes: 0 };
  movieRatings[movieId].total += rating;
  movieRatings[movieId].votes += 1;

  res.json({
    average: movieRatings[movieId].total / movieRatings[movieId].votes,
    votes: movieRatings[movieId].votes,
  });
});

app.get("/api/find-films", async (req, res) => {
  const genres = req.query.genres;
  const apiKey = process.env.TMDB_API_KEY;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genres}&language=en-US&page=1&sort_by=popularity.desc`
    );
    const data = await response.json();

    res.json({ results: data.results });
  } catch (error) {
    console.error("Error fetching films:", error);
    res.status(500).json({ error: "Failed to fetch films." });
  }
});


app.get("/api/top-rated", async (req, res) => {
  const apiKey = process.env.TMDB_API_KEY;
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`);
    const data = await response.json();
    res.json({ results: data.results });
  } catch (error) {
    console.error("Error fetching top-rated movies:", error);
    res.status(500).json({ error: "Failed to fetch top-rated movies." });
  }
});

//sign up
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const existingUser = await UserRepo.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const newUser = {
      username,
      email: '',
      password,
      google_id: null,
      profile_image_url: null
    };

    const createdUser = await UserRepo.create(newUser);
    res.status(200).json({ message: 'Signup successful!', userId: createdUser.id });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});


// login
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await UserRepo.verifyPassword(identifier, password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('Logged-in user:', user);
    req.session.user = user; // lưu session

    res.status(200).json({ message: 'Login successful', userId: user.id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});



app.post('/api/reset-password', async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json({ message: 'Missing username or new password' });
  }

  try {
    const success = await adminRepo.updatePasswordByUsername(username, newPassword);

    if (success) {
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Server error while updating password' });
  }
});

// Serve public assets BEFORE wildcard route
app.use('/stylesheets', express.static(path.join(__dirname, 'public', 'stylesheets')));
app.use('/Javascripts', express.static(path.join(__dirname, 'public', 'Javascripts')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));



// Allow access to auth.html even when not logged in
app.get("/auth.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "auth.html"));
});
// Kiểm tra user hiện tại (dùng cho redirect sau login)
app.get('/check-auth', (req, res) => {
  const user = req.user || req.session.user;

  if (user) {
    return res.json({
      isAuthenticated: true,
      username: user.username,
      role: user.role || 'user'
    });
  }

  res.status(401).json({ isAuthenticated: false });
});

app.get("/updateprofile.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "updateprofile.html"));
});
app.get("/search.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "search.html"));
});
app.get("/badge.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "badge.html"));
});
app.get("/playlist.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "playlist.html"));
});

app.get("/star.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "star.html"));
});

app.get("/MovieDetail.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "MovieDetail.html"));
});
app.get("/admin.html", ensureAdminHtml, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Protect main app routes
app.get("/", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/index.html", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("*", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;