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
    async rateMovie(star) {
      this.selectedStars = star;

      const ratedMovie = {
        id: this.movie.id,
        title: this.movie.title,
        poster: this.movie.poster,
        year: this.movie.year,
        rating: star
      };

      try {
        const res = await fetch('/api/ratings/rate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            movieId: ratedMovie.id,
            rating: ratedMovie.rating,
            title: ratedMovie.title,
            poster: ratedMovie.poster,
            year: ratedMovie.year
          })
        });

        if (!res.ok) {
          const err = await res.text();
          console.error('❌ Failed to save rating:', err);
          this.showToast('error', 'Rating Failed', 'Could not save your rating.');
          return;
        }

        this.showToast('success', 'Rating Saved!', `You rated "${ratedMovie.title}" with ${star} star(s)!`);
      } catch (err) {
        console.error('❌ Error rating movie:', err);
        this.showToast('error', 'Rating Error', 'An unexpected error occurred.');
      }
    },


    async addToPlaylist(movie) {
      try {
        console.log("🎬 Movie raw data:", movie);

        // Fetch current playlist to check for duplicates
        const resPlaylist = await fetch('/api/playlist/my', {
          credentials: 'include'
        });

        if (!resPlaylist.ok) {
          console.warn("⚠️ Unable to fetch current playlist.");
        }

        const data = await resPlaylist.json();
        const currentPlaylist = data.playlist || [];

        const exists = currentPlaylist.some((item) => item.movie_id === movie.id || item.id === movie.id);
        if (exists) {
          this.showToast('info', 'Already Added', `"${movie.title}" is already in your playlist.`);
          return;
        }

        // Prepare payload
        const payload = {
          id: movie.id || '',
          title: movie.title || '',
          poster: movie.poster || '',
          year: movie.year || '',
          rating: movie.rating === 'N/A' || movie.rating == null ? 0 : Number(movie.rating)
        };

        if (!payload.id || !payload.title || !payload.poster || !payload.year) {
          console.warn("⚠️ Incomplete payload:", payload);
          this.showToast('error', 'Invalid Movie', 'Movie information is incomplete.');
          return;
        }

        console.log("📦 Sending payload:", payload);

        const res = await fetch('/api/playlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          if (res.status === 409) {
            this.showToast('info', 'Already Added', `"${movie.title}" is already in your playlist.`);
            return;
          }
          const errorText = await res.text();
          console.error('❌ Add to playlist failed:', errorText);
          this.showToast('error', 'Failed', `Could not add "${movie.title}" to your playlist.`);
          return;
        }


        const added = await res.json();
        console.log("✅ Playlist add response:", added);
        this.showToast('success', 'Added!', `"${movie.title}" has been added to your playlist!`);

      } catch (err) {
        console.error('❌ Error adding to playlist:', err);
        this.showToast('error', 'Error', 'An unexpected error occurred.');
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
