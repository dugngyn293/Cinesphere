const { createApp, ref, onMounted, computed, nextTick } = Vue;

createApp({
  setup() {
    const user = ref({
      displayName: '',
      email: '',
      photo: '',
      checkinDays: 0,
      contributionScore: 0,
    });

    const showModal = ref(true);
    const burgerOpen = ref(false);
    const activeSection = ref("home");

    const showBadgeInfo = ref(false); // For Check-in badge
    const showContributionInfo = ref(false); // For Contribution badge

    const selectedGenres = ref(new Set());

    const badgeImage = computed(() => {
      const days = user.value.checkinDays;
      if (days >= 100) return '/images/gold.png';
      if (days >= 50) return '/images/silver.png';
      return '/images/bronze.png';
    });

    const contributionBadgeImage = computed(() => {
      const score = user.value.contributionScore;
      if (score >= 500) return '/images/gold.png';
      if (score >= 100) return '/images/silver.png';
      return '/images/bronze.png';
    });

    const playlists = ref([
      { name: "Favorites" },
      { name: "Watch Later" }
    ]);

    const searchQuery = ref("");
    const searchResults = ref([]);
    const searchResultsSection = ref(null);

    const ratedMovies = ref(new Set());

    const genreMap = {
      28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
      99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
      27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
      10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
    };

    const createNewPlaylist = () => {
      const name = prompt("Enter playlist name:", "New Playlist");
      if (name) {
        playlists.value.push({ name });
      }
    };

    const deletePlaylist = (index) => {
      if (confirm(`Delete playlist "${playlists.value[index].name}"?`)) {
        playlists.value.splice(index, 1);
      }
    };

    const selectedPlaylist = ref(null);

    const openPlaylist = (playlist) => {
      selectedPlaylist.value = playlist;
    };

    const closePlaylist = () => {
      selectedPlaylist.value = null;
    };

    const fetchTrailerUrl = async (movieId) => {
      try {
        const res = await fetch(`/api/trailer?id=${movieId}`);
        const data = await res.json();
        return data.trailerUrl || null;
      } catch (err) {
        console.error("Trailer fetch failed", err);
        return null;
      }
    };

    const searchMovies = async () => {
      console.log("Searching for:", searchQuery.value);
      const url = `/api/search?query=${searchQuery.value}`;

      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' },
        });
        const data = await res.json();

        const enrichedResults = await Promise.all(
          (data.results || []).map(async (movie) => {
            const trailerUrl = await fetchTrailerUrl(movie.id);
            return {
              id: movie.id,
              title: movie.title,
              releaseYear: movie.release_date?.slice(0, 4) || "N/A",
              genres: movie.genre_ids?.map(id => genreMap[id]).filter(Boolean).join(", "),
              overview: movie.overview,
              poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : null,
              trailerUrl,
              rating: 0,
              votes: 0,
            };
          })
        );

        searchResults.value = enrichedResults;

        nextTick(() => {
          searchResultsSection.value?.scrollIntoView({ behavior: 'smooth' });
        });

      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    const rateMovie = (movie, newRating) => {
      const movieKey = `${user.value.email}-${movie.id}`;

      // Check if the user has already rated this movie
      if (ratedMovies.value.has(movieKey)) {
        alert("You've already rated this movie!");
        return;
      }

      // Update the movie's votes and average rating
      movie.votes += 1;
      movie.rating = ((movie.rating * (movie.votes - 1)) + newRating) / movie.votes;

      // Add the movie ID to the set of rated movies
      ratedMovies.value.add(movieKey);

      // Increase the user's contribution score by 1
      user.value.contributionScore += 1;

      // Optionally, save the updated contribution score to the backend
      updateUserContributionScore(user.value.contributionScore);
    };

    const updateUserContributionScore = async (newScore) => {
      try {
        const res = await fetch("/api/update-contribution-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contributionScore: newScore,
            votedMovies: Array.from(ratedMovies.value) // Send the list of rated movies
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to update contribution score");
        }
      } catch (error) {
        console.error("Error updating contribution score:", error);
      }
    };


    const addToPlaylist = (movie) => {
      alert(`Added "${movie.title}" to your playlist!`); // Replace with real logic later
    };

    
    
    const toggleGenre = (genreId) => {
      if (selectedGenres.value.has(genreId)) {
        selectedGenres.value.delete(genreId);
      } else {
        selectedGenres.value.add(genreId);
      }
    };
    
    
    const clearGenres = () => {
      selectedGenres.value.clear();
    };
    
    
    const findSuggestedFilms = async () => {
      if (selectedGenres.value.size === 0) {
        alert("Please select at least one genre.");
        return;
      }
    
      const genreIds = Array.from(selectedGenres.value);
      const query = genreIds.join(',');
    
      try {
        const res = await fetch(`/api/find-films?genres=${query}`);
        const data = await res.json();
    
        if (data.results && data.results.length > 0) {
          const enrichedResults = await Promise.all(
            data.results.map(async (movie) => {
              const trailerUrl = await fetchTrailerUrl(movie.id); 
              return {
                id: movie.id,
                title: movie.title,
                releaseYear: movie.release_date?.slice(0, 4) || "N/A",
                genres: movie.genre_ids?.map(id => genreMap[id]).filter(Boolean).join(", "),
                overview: movie.overview,
                poster: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                  : null,
                trailerUrl,
                rating: 0, 
                votes: 0, 
              };
            })
          );
    
          searchResults.value = enrichedResults.slice(0, 3); // Take top 3
    
        } else {
          alert("No films found for the selected genres.");
        }
      } catch (err) {
        console.error("Error fetching suggested films:", err);
        alert("Something went wrong while fetching films. Please try again.");
      }
    };    
    
    
    
    
    onMounted(async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.user) {
          user.value = {
            ...user.value,
            ...data.user,
            checkinDays: data.user.checkinDays ?? 0,
            contributionScore: data.user.contributionScore ?? 0,
          };
          showModal.value = false;
        }
      } catch {
        showModal.value = true;
      }
    });

    const toggleBurger = () => {
      burgerOpen.value = !burgerOpen.value;
    };

    const setSection = (section) => {
      activeSection.value = section;
      burgerOpen.value = false;
    };

    return {
      user,
      showModal,
      burgerOpen,
      toggleBurger,
      activeSection,
      setSection,
      showBadgeInfo,
      showContributionInfo,
      badgeImage,
      contributionBadgeImage,
      playlists,
      createNewPlaylist,
      deletePlaylist,
      selectedPlaylist,
      openPlaylist,
      closePlaylist,
      searchQuery,
      searchResults,
      searchMovies,
      searchResultsSection,
      rateMovie,
      addToPlaylist,
      ratedMovies,
      toggleGenre,
      clearGenres,
      genreMap, 
      selectedGenres,
      findSuggestedFilms,
      
    };
  },
  template: `
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Sign in to continue</h2>
        <a href="/auth/google"><button>Sign in with Google</button></a>
      </div>
    </div>

    <div v-else>
      <!-- Top Bar -->
      <div class="navbar">
        <div class="left">
          <button @click="toggleBurger">☰</button>
          <h1 style="margin-left: 10px;">Welcome, {{ user.displayName }}!</h1>
        </div>
        <div class="right">
          <img
            v-if="user.photo"
            :src="user.photo"
            alt="Avatar"
            referrerpolicy="no-referrer"
            style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"
          />
        </div>
      </div>

      <!-- Burger Menu -->
      <div v-if="burgerOpen" class="burger-menu">
        <ul>
          <li 
            :class="{ active: activeSection === 'home' }" 
            @click="setSection('home')"
          >
            Home
          </li>
          <li 
            :class="{ active: activeSection === 'profile' }" 
            @click="setSection('profile')"
          >
            Your Profile
          </li>
          <li 
            :class="{ active: activeSection === 'playlists' }" 
            @click="setSection('playlists')"
          >
            Playlists
          </li>
          <li 
            :class="{ active: activeSection === 'suggestions' }" 
            @click="setSection('suggestions')"
          >
            Film Suggestions
          </li>
          <li>
            <a href="/logout">Logout</a>
          </li>

        </ul>
      </div>

      
      <!-- Active Section -->
      <div class="content">
        <div v-if="activeSection === 'home'">
          <!-- Search Bar -->
          <div class="search-bar">
            <input type="text" v-model="searchQuery" placeholder="Search for movies by name" />
            <button @click="searchMovies">Search</button>
          </div>
          <!-- Search Results -->
          <div ref="searchResultsSection" v-if="searchResults.length > 0" class="search-results">
            <h3>Search Results:</h3>
            <div class = "search-results-box">
            <ul>
              <li v-for="movie in searchResults" :key="movie.id" style="margin-bottom: 20px; display: flex; gap: 12px;">
                <img
                  v-if="movie.poster"
                  :src="movie.poster"
                  alt="Poster"
                  style="height: 150px; border-radius: 4px; object-fit: cover;"
                />
                <div>
                  <h4>{{ movie.title }}</h4>
                  <p>
                    <strong>Year:</strong> {{ movie.releaseYear }}<br>
                    <strong>Genres:</strong> {{ movie.genres || 'N/A' }}
                  </p>
                  <p style="font-style: italic;">{{ movie.overview }}</p>
                  <p v-if="movie.trailerUrl">
                    <a :href="movie.trailerUrl" target="_blank">🎬 Watch Trailer</a>
                  </p>
                  <p>
                    <button @click="addToPlaylist(movie)">➕ Add to Playlist</button>
                  </p>

                  <p>
                    <strong>Rating:</strong> {{ movie.rating.toFixed(1) }} ({{ movie.votes }})
                  </p>

                  <p>
                    Rate:
                    <button
                      v-for="star in 5"
                      :key="star"
                      :disabled="ratedMovies.has(user.email + '-' + movie.id)"
                      @click="rateMovie(movie, star)"
                    >
                      {{ star }}⭐
                    </button>
                    <span v-if="ratedMovies.has(user.email + '-' + movie.id)" style="margin-left: 8px; color: green;">
                      ✅ You rated this!
                    </span>
                  </p>


                </div>
              </li>
            </ul>
            </div>

          </div>

          <h2>Home</h2>
          <p>Coming soon...</p>
        </div>
        <div v-if="activeSection === 'profile'" class="profile-section">
          <h2>Your Profile</h2>
          <p><strong>Username:</strong> {{ user.displayName }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>

          <!-- Check-in Badge -->
          <div class="badge-section">
            <p>
              <strong>Check-in Badge:</strong>
              <img :src="badgeImage" alt="Check-in Badge" style="height: 40px; vertical-align: middle;" />
              <span>{{ user.checkinDays }}</span> <!-- Display check-in days -->
              <a href="#" @click.prevent="showBadgeInfo = !showBadgeInfo" style="margin-left: 10px; font-size: 18px;">❓</a>
            </p>
            <p v-if="showBadgeInfo" class="badge-info">
              <small>
                Badges are based on your check-in days:<br>
                🟤 Bronze: &lt; 20 days<br>
                ⚪ Silver: &lt; 50 days<br>
                🟡 Gold: ≥ 100 days
              </small>
            </p>
          </div>

          <!-- Contribution Badge -->
          <div class="badge-section">
            <p>
              <strong>Contribution Badge:</strong>
              <img :src="contributionBadgeImage" alt="Contribution Badge" style="height: 40px; vertical-align: middle;" />
              <span>{{ user.contributionScore }}</span> <!-- Display contribution score -->
              <a href="#" @click.prevent="showContributionInfo = !showContributionInfo" style="margin-left: 10px; font-size: 18px;">❓</a>
            </p>
            <p v-if="showContributionInfo" class="badge-info">
              <small>
                Badges are based on your contribution score:<br>
                🟤 Bronze: &lt; 100 contributions<br>
                ⚪ Silver: ≥ 100 contributions<br>
                🟡 Gold: ≥ 500 contributions
              </small>
            </p>
          </div>


        </div>


       <div v-if="activeSection === 'playlists'" class="playlists-section">
          <h2>Your Playlists</h2>

          <ul>
            <li v-for="(playlist, index) in playlists" :key="index" style="margin-bottom: 8px;">
              <a href="#" @click.prevent="openPlaylist(playlist)">
                {{ playlist.name }}
              </a>
              <button @click="deletePlaylist(index)" style="margin-left: 10px; color: red;">
                🗑️ Delete
              </button>
            </li>
          </ul>

          <!-- Create button -->
          <button @click="createNewPlaylist" style="margin-top: 10px;">
            ➕ Create New Playlist
          </button>

          <!-- Playlist popup card -->
          <div v-if="selectedPlaylist" class="playlist-popup">
            <button @click="closePlaylist" class="close-btn">❌</button>
            <h3>{{ selectedPlaylist.name }}</h3>
            <p><a href="#">📽️ View Movies in this Playlist</a></p>
          </div>
        </div>




        <div v-if="activeSection === 'suggestions'" class="suggestions-section">
          <h2>Film Suggestions</h2>

          <p>Select genres you're interested in:</p>
          <div class="genre-boxes">
            <button 
              v-for="[id, name] in Object.entries(genreMap)" 
              :key="id"
              @click="toggleGenre(Number(id))"
              :class="{ selected: selectedGenres.has(Number(id)) }"
            >
              {{ name }}
            </button>
          </div>

          <div style="margin-top: 10px;">
            <button @click="findSuggestedFilms" :disabled="selectedGenres.size === 0">
              🔍 Find Films
            </button>
            <button @click="clearGenres" style="margin-left: 10px;">
              🔄 Refresh
            </button>
            <div v-if="searchResults.length > 0">
              <h3>Suggested Films:</h3>
              <div class="search-results">
                <ul>
                  <li v-for="movie in searchResults" :key="movie.id" style="margin-bottom: 20px; display: flex; gap: 12px;">
                    <img
                      v-if="movie.poster"
                      :src="movie.poster"
                      alt="Poster"
                      style="height: 150px; border-radius: 4px; object-fit: cover;"
                    />
                    <div>
                      <h4>{{ movie.title }}</h4>
                      <p><strong>Year:</strong> {{ movie.releaseYear || 'N/A' }}</p>
                      <p><strong>Genres:</strong> {{ movie.genres || 'N/A' }}</p>
                      <p style="font-style: italic;">{{ movie.overview }}</p>
                      <p v-if="movie.trailerUrl">
                        <a :href="movie.trailerUrl" target="_blank">🎬 Watch Trailer</a>
                      </p>
                      <p>
                        <button @click="addToPlaylist(movie)">➕ Add to Playlist</button>
                      </p>

                      <p>
                        <strong>Rating:</strong> {{ movie.rating.toFixed(1) }} ({{ movie.votes }})
                      </p>

                      <p>
                        Rate:
                        <button
                          v-for="star in 5"
                          :key="star"
                          :disabled="ratedMovies.has(user.email + '-' + movie.id)"
                          @click="rateMovie(movie, star)"
                        >
                          {{ star }}⭐
                        </button>
                        <span v-if="ratedMovies.has(user.email + '-' + movie.id)" style="margin-left: 8px; color: green;">
                          ✅ You rated this!
                        </span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

    </div>
  `
}).mount("#app");
