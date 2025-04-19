const { createApp, ref, onMounted, computed, nextTick } = Vue;

createApp({
  setup() {
    const user = ref({
      displayName: '',
      email: '',
      photo: '',
      checkinDays: 0,
    });

    const showModal = ref(true);
    const burgerOpen = ref(false);
    const activeSection = ref("home");

    const showBadgeInfo = ref(false);

    const badgeImage = computed(() => {
      const days = user.value.checkinDays;
      if (days >= 100) return '/images/gold.png';
      if (days >= 50) return '/images/silver.png';
      return '/images/bronze.png';
    });
    const playlists = ref([
      { name: "Favorites" },
      { name: "Watch Later" }
    ]);
    const searchQuery = ref("");
    const searchResults = ref([]);
    const searchResultsSection = ref(null);
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
    
    
    
    
    
    
    
    onMounted(async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.user) {
          user.value = {
            ...user.value,
            ...data.user,
            checkinDays: data.user.checkinDays ?? 0,
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
      badgeImage,
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
          <li @click="setSection('home')">Home</li>
          <li @click="setSection('profile')">Your Profile</li>
          <li @click="setSection('playlists')">Playlists</li>
          <li @click="setSection('suggestions')">Film Suggestions</li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search for movies" />
        <button @click="searchMovies">Search</button>
      </div>
      <!-- Search Results -->
      <div ref="searchResultsSection" v-if="searchResults.length > 0" class="search-results">
        <h3>Search Results:</h3>
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
            </div>
          </li>
        </ul>


      </div>

      <!-- Active Section -->
      <div class="content">
        <div v-if="activeSection === 'home'">
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




        <div v-if="activeSection === 'suggestions'">
          <h2>Film Suggestions</h2>
          <p>Coming soon...</p>
        </div>
      </div>
    </div>
  `
}).mount("#app");
