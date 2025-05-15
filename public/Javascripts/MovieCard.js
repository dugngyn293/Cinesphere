export const MovieCard = {
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="movie-card">
      <a href="./movie-details.html">
        <figure class="card-banner">
          <img :src="movie.poster" :alt="movie.title + ' movie poster'">
        </figure>
      </a>

      <div class="title-wrapper">
        <a href="./movie-details.html">
          <h3 class="card-title">{{ movie.title }}</h3>
        </a>
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
    </div>
  `
};
