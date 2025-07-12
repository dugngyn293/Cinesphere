Cinesphere

Cinesphere is a full-stack movie web application that lets users search for films, build personal playlists, rate movies, and manage profiles with secure Google OAuth and local authentication. Admins can manage users through a dedicated admin panel.
Features

    Authentication
        Secure username + password login (bcrypt-hashed)
        Google OAuth 2.0 sign-in with automatic account linking
        Express-session with secure cookie settings & manual in-memory rate-limiter
    Profile Management
        Editable username, password & avatar (file uploads via Multer)
        Dark / Light theme toggle with localStorage persistence
    Movie Search & Discovery
        Search TMDB catalogue in real-time
        View trailers, top-rated lists & genre-based carousels
    Playlists & Ratings
        Add / remove movies from personal playlist (localStorage)
        Star-rating widget with per-user vote limiting
    Admin Dashboard
        View, search & reset user passwords
        Route protection (ensureAdminHtml middleware)
    Security
        SQL-injection-safe repository layer (prepared statements)
        XSS-safe output, secure cookies, rate-limiting

🛠️ Tech Stack

    Frontend: Vanilla JS (Vue 3 CDN mode), HTML5, CSS3 (custom responsive grid)
    Backend: Node.js, Express 4, Passport, Multer
    Database: MySQL 8 (mysql2 + pool)
    APIs: TMDB API, Google OAuth 2.0
    Misc: SweetAlert2, dotenv

Quick Start
1. Clone & Install

# clone
git clone https://github.com/UAdelaide/25S1_WDC_UG_Groups_88.git
cd 25S1_WDC_UG_Groups_88

# install server dependencies
npm install

2. Create \.env

Copy .env.example and fill in your own credentials:

cp .env.example .env

Required variables:

DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
SESSION_SECRET
TMDB_API_KEY
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

3. MySQL Setup

CREATE DATABASE cinesphere;
-- run schema.sql (in /database) to create tables

Ensure the user in .env has rights to this DB.
4. Run the App

# start in dev mode
npm start
# server listens on http://localhost:8080

Open http://localhost:8080 to sign up or sign in.
Project Structure

├── app.js               # Express entrypoint
├── routes/              # Express routers
├── repositories/        # DB access layer (prepared statements)
├── middleware/          # Auth, rate-limit, upload, etc.
├── public/              # Static frontend (HTML, CSS, JS, images)
│   ├── stylesheets/
│   ├── Javascripts/
│   └── ...
├── database/
│   ├── pool.js          # MySQL pool
│   └── schema.sql       # Table definitions
└── README.md

Admin Account Setup

    Generate the password hash Run the hash-password.js file to generate a bcrypt hash for the password admin123.

    Create the admin user Copy the generated hash and use it in an SQL script to insert a new user into the users table with the role set to 'admin'.

    Sign in Log in to the app using the admin username and the password admin123.
