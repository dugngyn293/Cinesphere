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

dotenv.config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"], 
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/api/user", (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });

  const user = {
    displayName: req.user.displayName,
    email: req.user.emails?.[0]?.value,
    photo: req.user.photos?.[0]?.value, 
  };
  res.json({ user });
});



app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
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
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genres}&api_key=${apiKey}`);
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
