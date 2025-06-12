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

    async addToPlaylist(movie) {
      try {
        console.log("🎬 Movie raw data:", movie);

        // Sanitize and prepare payload
        const payload = {
          id: movie.id || '',
          title: movie.title || '',
          poster: movie.poster || '',
          year: movie.year || '',
          rating: movie.rating === 'N/A' || movie.rating == null ? 0 : Number(movie.rating)
        };

        // Validate before sending
        if (!payload.id || !payload.title || !payload.poster || !payload.year) {
          console.warn("⚠️ Payload thiếu trường:", payload);
          this.showToast('error', 'Invalid Movie', 'Movie info incomplete.');
          return;
        }

        console.log("📦 Payload gửi backend:", payload);

        const res = await fetch('/api/playlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ Add to playlist failed:', errorText);
          this.showToast('error', 'Failed', `Could not add "${movie.title}" to playlist.`);
          return;
        }

        const data = await res.json();
        console.log("✅ Playlist add response:", data);
        this.showToast('success', 'Added!', `"${movie.title}" added to your playlist!`);

      } catch (err) {
        console.error('❌ Error adding to playlist:', err);
        this.showToast('error', 'Error', 'Unexpected error occurred.');
      }
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
