-- Indexes for CineSphere Database

-- Speeds up searches by title
CREATE INDEX idx_movies_title ON movies(title);

-- Speeds up searches by release date
CREATE INDEX idx_movies_release_date ON movies(release_date);

-- Speeds up searching for reviews by movie
CREATE INDEX idx_reviews_movie_id ON reviews(movie_id);

-- Speeds up filtering reviews by user
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- Speeds up searches by rating
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Speeds up searches by review date
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Optimizes queries that sort or filter by when achievements were earned
CREATE INDEX idx_user_achievements_achieved_at ON user_achievements(achieved_at);