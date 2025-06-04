import { MovieCard } from './MovieCard.js';

export const TopRatedMovies = {
  components: {
    MovieCard
  },
  template: `
    <section class="top-rated">
      <div class="container">
        <p class="section-subtitle">Online Streaming</p>
        <h2 class="h2 section-title">Top Rated Movies</h2>

        <ul class="filter-list">
          <li v-for="filter in filters" :key="filter">
            <button class="filter-btn">{{ filter }}</button>
          </li>
        </ul>

        <ul class="movies-list">
          <li v-for="movie in topRatedMovies" :key="movie.id">
            <MovieCard :movie="movie" @open-detail="goToDetail" />
          </li>
        </ul>
      </div>
    </section>
  `,
  data() {
    return {
      filters: ['Movies', 'TV Shows', 'Documentary', 'Sports'],
      topRatedMovies: []
    };
  },
  mounted() {
    this.fetchTopRated();
  },
  methods: {
    goToDetail(id) {
      window.location.href = `./MovieDetail.html?id=${id}`;
    },
    async fetchTopRated() {
      const apiKey = '6c90413a736469cc0670b634e5f3f7c1';
      const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        this.topRatedMovies = (data.results || []).map((item) => ({
          id: item.id,
          title: item.title,
          year: item.release_date ? item.release_date.slice(0, 4) : 'N/A',
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : null,
          quality: 'HD',
          duration: 'N/A',
          durationISO: '',
          rating: item.vote_average ? item.vote_average.toFixed(1) : 'NR',

          overview: item.overview || 'No description available.'
        }));

      } catch (err) {
        console.error('Failed to fetch top rated movies:', err);
      }
    }
  }
};
