export const Movies = {
  template: `
    <section class="movies-page">
      <div class="container">
        <h2 class="h2 section-title">Movies</h2>

        <!-- Category Filter (multi-select) -->
        <ul class="filter-list">
          <li v-for="category in categories" :key="category">
            <button
              class="filter-btn"
              :class="{ active: selectedCategories.includes(category) }"
              @click="toggleCategory(category)">
              {{ category }}
            </button>
          </li>
        </ul>

        <!-- Movies List -->
        <ul class="shows-list">
          <li v-for="movie in filteredMovies" :key="movie.id">
            <div class="show-card" @click="goToDetail(movie.id)">
              <img :src="movie.poster" :alt="movie.title" class="show-poster" />
              <div class="show-info">
                <h3 class="show-title">{{ movie.title }}</h3>
                <p class="show-details">{{ movie.year }}</p>
                <p class="show-rating">Rating: {{ movie.rating }}</p>
              </div>

              <!-- Star Rating -->
              <div class="star-rating" @click.stop>
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ filled: star <= movie.userRating }"
                  @click="rateMovie(movie, star)">
                  ★
                </span>
              </div>

              <!-- Add to Playlist Button -->
              <div class="playlist-wrapper" @click.stop>
                <button
                  class="playlist-btn"
                  :class="{ active: movie.inPlaylist }"
                  @click="addToPlaylist(movie)">
                  <span v-if="movie.inPlaylist">✔ In Playlist</span>
                  <span v-else><strong>＋</strong> Add to Playlist</span>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  `,
  data() {
    return {
      categories: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Animation', 'Horror', 'Romance', 'Thriller', 'Mystery'],
      selectedCategories: [],
      filteredMovies: [],
      genreMap: {
        Action: 28,
        Comedy: 35,
        Drama: 18,
        'Sci-Fi': 878,
        Animation: 16,
        Horror: 27,
        Romance: 10749,
        Thriller: 53,
        Mystery: 9648
      }
    };
  },
  watch: {
    selectedCategories: {
      handler() {
        this.fetchMoviesByGenres();
      },
      deep: true
    }
  },
  mounted() {

    this.selectedCategories = ['Action'];
    this.fetchMoviesByGenres();
  },
  methods: {
    toggleCategory(category) {
      if (this.selectedCategories.includes(category)) {
        this.selectedCategories = this.selectedCategories.filter(c => c !== category);
      } else if (this.selectedCategories.length < 4) {
        this.selectedCategories.push(category);
      } else {
        Swal && Swal.fire({
          icon: 'info',
          title: 'Limit reached',
          text: 'You can only select up to 4 categories.',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }

    },
    async fetchMoviesByGenres() {
      if (this.selectedCategories.length === 0) {
        this.filteredMovies = [];
        return;
      }
      const genreIds = this.selectedCategories.map(cat => this.genreMap[cat]).join(',');
      try {
        const res = await fetch(`/api/find-films?genres=${genreIds}`);
        const data = await res.json();
        this.filteredMovies = (data.results || []).map(movie => ({
          id: movie.id,
          title: movie.title,
          year: movie.release_date?.split('-')[0] || 'N/A',
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '/images/default.jpg',
          rating: movie.vote_average || 'N/A',
          description: movie.overview || 'No description',
          inPlaylist: false,
          userRating: 0
        }));
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    },
    goToDetail(movieId) {
      location.assign(`MovieDetail.html?id=${movieId}`);
    },
    async addToPlaylist(movie) {
      try {
        console.log("📤 Sending payload:", movie); // debug log

        const res = await fetch('/api/playlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(movie)
        });

        if (res.ok) {
          movie.inPlaylist = true;

          Swal && Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Added to playlist!',
            text: movie.title,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            background: '#1e1e1e',
            color: '#fff'
          });
        } else if (res.status === 409) {
          Swal && Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: 'Already in Playlist',
            text: movie.title,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            background: '#2b2b00',
            color: '#fffacd'
          });
        } else {
          throw new Error(await res.text());
        }
      } catch (err) {
        console.error('❌ Failed to add to playlist:', err);
        Swal && Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Could not add to playlist.',
          toast: true,
          position: 'top-end',
          background: '#2b2b2b',
          color: '#fff'
        });
      }
    },



    async rateMovie(movie, rating) {
      movie.userRating = rating;

      const payload = {
        movieId: movie.id,
        rating: rating,
        title: movie.title,
        poster: movie.poster,
        year: movie.year
      };

      try {
        console.log('📤 Sending rating:', payload);

        const res = await fetch('/api/ratings/rate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const err = await res.text();
          console.error('❌ Failed to rate movie:', err);
          Swal && Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: `Could not rate "${movie.title}".`,
            toast: true,
            position: 'top-end',
            timer: 1800,
            showConfirmButton: false
          });
          return;
        }

        Swal && Swal.fire({
          icon: 'success',
          title: `⭐ ${rating} star${rating > 1 ? 's' : ''}`,
          text: `You rated "${movie.title}".`,
          toast: true,
          position: 'top-end',
          timer: 1800,
          showConfirmButton: false
        });

      } catch (err) {
        console.error('❌ Error rating movie:', err);
        Swal && Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred.',
          toast: true,
          position: 'top-end',
          timer: 1800,
          showConfirmButton: false
        });
      }
    }

  }
};