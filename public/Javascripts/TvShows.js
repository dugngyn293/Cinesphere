export const TvShows = {
  template: `
    <section class="tv-shows">
      <div class="container">
        <h2 class="h2 section-title">TV Shows</h2>

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

        <!-- TV Shows List -->
        <ul class="shows-list">
          <li v-for="show in tvShows" :key="show.id" class="show-item">
            <div class="show-card" @click="goToDetail(show.id)">
              <img :src="show.poster" :alt="show.title" class="show-poster" />
              <div class="show-info">
                <h3 class="show-title">{{ show.title }}</h3>
                <p class="show-details">{{ show.year }}</p>
                <p class="show-rating">Rating: {{ show.rating }}</p>

                <!-- Star Rating -->
                <div class="star-rating" @click.stop>
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="star"
                    :class="{ filled: star <= show.userRating }"
                    @click="rateShow(show, star)">
                    ★
                  </span>
                </div>

                <!-- Add to Playlist Button -->
                <div class="playlist-wrapper" @click.stop>
                  <button
                    class="playlist-btn"
                    :class="{ active: show.inPlaylist }"
                    @click="addToPlaylist(show)">
                    <span v-if="show.inPlaylist">✔ In Playlist</span>
                    <span v-else><strong>＋</strong> Add to Playlist</span>
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  `,
  data() {
    return {
      categories: ['Drama', 'Comedy', 'Action', 'Sci-Fi', 'Documentary', 'Mystery', 'Family', 'Crime', 'Animation'],
      selectedCategories: ['Drama'], // Default to Drama
      tvShows: [],
      genreMap: {
        Drama: 18,
        Comedy: 35,
        Action: 10759,
        'Sci-Fi': 10765,
        Documentary: 99,
        Mystery: 9648,
        Family: 10751,
        Crime: 80,
        Animation: 16
      }
    };
  },
  watch: {
    selectedCategories: {
      handler() {
        this.fetchTvShowsByGenres();
      },
      deep: true
    }
  },
  mounted() {
    this.fetchTvShowsByGenres();
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
    async fetchTvShowsByGenres() {
      if (this.selectedCategories.length === 0) {
        this.tvShows = [];
        return;
      }
      const genreIds = this.selectedCategories.map(cat => this.genreMap[cat]).join(',');
      try {
        const res = await fetch(`/api/discover-tv?genres=${genreIds}`);
        const data = await res.json();
        this.tvShows = (data.results || []).map(show => ({
          id: show.id,
          title: show.name,
          year: show.first_air_date?.split('-')[0] || 'N/A',
          poster: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/images/default.jpg',
          rating: show.vote_average || 'N/A',
          description: show.overview || 'No description available.',
          inPlaylist: false,
          userRating: 0
        }));
      } catch (error) {
        console.error('Failed to fetch TV shows:', error);
      }
    },
    goToDetail(showId) {
      location.assign(`MovieDetail.html?id=${showId}`);
    },
    async addToPlaylist(show) {
      try {
        const payload = {
          id: show.id,
          title: show.title,
          year: show.year,
          poster: show.poster,
          rating: show.rating,
          type: 'tv'
        };
        console.log('📤 Sending payload:', payload);

        const res = await fetch('/api/playlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(payload)

        });

        if (res.ok) {
          show.inPlaylist = true;

          Swal && Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Added to playlist!',
            text: show.title,
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
            text: show.title,
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


    async rateShow(show, rating) {
      show.userRating = rating; // cập nhật UI nga
      const payload = {
        movieId: show.id,
        rating: rating,
        title: show.title,
        poster: show.poster,
        year: show.year
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
          console.error('❌ Failed to rate show:', err);
          Swal && Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: `Could not rate "${show.title}".`,
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
          text: `You rated "${show.title}".`,
          toast: true,
          position: 'top-end',
          timer: 1800,
          showConfirmButton: false
        });

      } catch (err) {
        console.error('❌ Error rating show:', err);
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