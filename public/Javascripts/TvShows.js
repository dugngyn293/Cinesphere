export const TvShows = {
  template: `
    <section class="tv-shows">
      <div class="container">
        <h2 class="h2 section-title">TV Shows</h2>

        <!-- Category Filter -->
        <ul class="filter-list">
          <li v-for="category in categories" :key="category">
            <button
              class="filter-btn"
              :class="{ active: selectedCategory === category }"
              @click="selectCategory(category)">
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
      selectedCategory: 'Drama',
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
  mounted() {
    this.fetchTvShowsByGenre(this.selectedCategory);
  },
  methods: {
    selectCategory(category) {
      this.selectedCategory = category;
      this.fetchTvShowsByGenre(category);
    },
    async fetchTvShowsByGenre(category) {
      const genreId = this.genreMap[category];
      try {
        const res = await fetch(`/api/discover-tv?genres=${genreId}`);
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
    addToPlaylist(show) {
      const list = JSON.parse(localStorage.getItem('playlist')) || [];
      const exists = list.find(s => s.id === show.id);
      if (exists) {
        Swal.fire({
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
        list.push(show);
        localStorage.setItem('playlist', JSON.stringify(list));
        show.inPlaylist = true;
        Swal.fire({
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
      }
    },
    rateShow(show, rating) {
      show.userRating = rating;
      const list = JSON.parse(localStorage.getItem('ratedShows')) || [];
      const existing = list.find(s => s.id === show.id);
      if (existing) {
        existing.userRating = rating;
      } else {
        list.push({ ...show, userRating: rating });
      }
      localStorage.setItem('ratedShows', JSON.stringify(list));
      Swal.fire({
        icon: 'info',
        title: `⭐ ${rating} star${rating > 1 ? 's' : ''}`,
        text: `You just rated "${show.title}".`,
        showConfirmButton: false,
        timer: 1800,
        toast: true,
        position: 'top-end',
        background: '#1e1e1e',
        color: '#fff'
      });
    }
  }
};
