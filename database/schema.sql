CREATE TABLE users (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username    VARCHAR (255) NOT NULL UNIQUE,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    CHAR(60)     NOT NULL,        
  role        ENUM('user','admin') DEFAULT 'user',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  password_reset_token CHAR(64) DEFAULT NULL, -- Stores SHA256 hash of reset token
  password_reset_expires DATETIME DEFAULT NULL
);

CREATE TABLE movies (
  id     BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  external_id  INT NOT NULL UNIQUE,  -- TMDb id
  title        VARCHAR(255),
  release_date DATE,
  director     VARCHAR(255) NOT NULL,
  poster_url   VARCHAR(255)
);

-- on delete cascade = delete all items when a user is deleted
-- FOREIGN KEY (__) REFERENCES tablet() represents a connection between the tables
CREATE TABLE user_movie (
  user_id   BIGINT UNSIGNED,
  movie_id  BIGINT UNSIGNED,
  PRIMARY KEY (user_id, movie_id),
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  INDEX um_user (user_id),
  INDEX um_movie (movie_id)
);

CREATE TABLE reviews (
  id  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED,
  movie_id   BIGINT UNSIGNED,
  rating DECIMAL(3,1) CHECK (rating >= 1 AND rating <= 10),
  review_text    TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_movie (user_id, movie_id), -- avoid duplicates
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE achievements (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(50) UNIQUE,
  label       VARCHAR(100),
  description TEXT
);

CREATE TABLE user_achievements (
  user_id         BIGINT UNSIGNED,
  achievement_id  INT UNSIGNED,
  achieved_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, achievement_id),
  FOREIGN KEY (user_id)        REFERENCES users(id)        ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);
