export const MovieCard = {
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  emits: ['open-detail'],
  template: `
    <div class="movie-card">
      <figure class="card-banner">
        <img
          :src="movie.poster"
          :alt="movie.title + ' movie poster'"
          class="poster-img"
        />
      </figure>

      <div class="title-wrapper">
        <h3 class="card-title clickable-title" @click="$emit('open-detail', movie.id)">
          {{ movie.title }}
        </h3>
        <time :datetime="movie.year">{{ movie.year }}</time>
      </div>

      <div class="card-meta">
        <div class="badge badge-outline">{{ movie.quality }}</div>

        <div class="duration">
          <ion-icon name="time-outline"></ion-icon>
          <time :datetime="movie.durationISO">{{ movie.duration }}</time>
        </div>

        <div class="rating">
          <ion-icon name="star"></ion-icon>
          <data>{{ movie.rating }}</data>
        </div>
      </div>

      <div class="star-rating">
        <span
          v-for="star in 5"
          :key="star"
          :class="{ filled: star <= selectedStars }"
          @click="rateMovie(star)"
        >★</span>
      </div>

      <button class="add-playlist-btn" @click="addToPlaylist(movie)">
        ➕ Add to Playlist
      </button>
    </div>
  `,
  data() {
    return {
      selectedStars: 0
    };
  },
  methods: {
    rateMovie(star) {
      this.selectedStars = star;

      const ratedMovie = {
        id: this.movie.id,
        title: this.movie.title,
        poster: this.movie.poster,
        year: this.movie.year,
        rating: star
      };

      const ratedMovies = JSON.parse(localStorage.getItem('ratedMovies')) || [];
      const updated = ratedMovies.filter((m) => m.id !== ratedMovie.id);
      updated.push(ratedMovie);

      localStorage.setItem('ratedMovies', JSON.stringify(updated));

      this.showToast('success', 'Rating Saved!', `You rated "${this.movie.title}" with ${star} star(s)!`);
    },
    addToPlaylist(movie) {
      const playlist = JSON.parse(localStorage.getItem('playlist')) || [];

      const exists = playlist.some((item) => item.id === movie.id);
      if (exists) {
        this.showToast('info', 'Already in Playlist', `"${movie.title}" is already in your playlist.`);
        return;
      }

      playlist.push({
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        year: movie.year,
        rating: movie.rating
      });

      localStorage.setItem('playlist', JSON.stringify(playlist));
      this.showToast('success', 'Added!', `"${movie.title}" added to your playlist!`);
    },
    showToast(icon, title, text) {
      Swal.fire({
        icon: icon,
        title: title,
        text: text,
        timer: 1500,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
        customClass: {
          popup: 'custom-toast-position'
        }
      });
    }
  }
};
