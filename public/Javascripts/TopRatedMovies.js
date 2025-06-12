import { MovieCard } from './MovieCard.js';

export const TopRatedMovies = {
  components: {
    MovieCard
  },
  template: `
    <section class="top-rated">
      <div class="container">
        <p class="section-subtitle">Online Streaming</p>
        <h2 class="h2 section-title">Top Rated</h2>

        <ul class="filter-list">
          <li v-for="filter in filters" :key="filter">
            <button
              class="filter-btn"
              :class="{ active: selectedFilter === filter }"
              @click="changeFilter(filter)"
            >
              {{ filter }}
            </button>
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
      filters: ['Movies', 'TV Shows', 'Documentary'],
      selectedFilter: 'Movies',
      topRatedMovies: []
    };
  },
  mounted() {
    this.fetchTopRated();
  },
  methods: {
    changeFilter(filter) {
      if (this.selectedFilter !== filter) {
        this.selectedFilter = filter;
        this.fetchTopRated();
      }
    },
    goToDetail(id) {
      window.location.href = `./MovieDetail.html?id=${id}`;
    },
    async fetchTopRated() {
      const apiKey = '6c90413a736469cc0670b634e5f3f7c1';
      let url = '';

      switch (this.selectedFilter) {
        case 'TV Shows':
          url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`;
          break;
        case 'Documentary':
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=99&sort_by=vote_average.desc&vote_count.gte=100&language=en-US&page=1`;
          break;
        case 'Movies':
        default:
          url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
          break;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        this.topRatedMovies = (data.results || []).slice(0, 12).map((item) => {
          let year = 'N/A';
          if (item.release_date) {
            year = item.release_date.slice(0, 4);
          } else if (item.first_air_date) {
            year = item.first_air_date.slice(0, 4);
          }

          return {
            id: item.id,
            title: item.title || item.name || 'Untitled',
            year: year,
            poster: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : null,
            quality: 'HD',
            duration: 'N/A',
            durationISO: '',
            rating: item.vote_average ? item.vote_average.toFixed(1) : 'NR',
            overview: item.overview || 'No description available.'
          };
        });

      } catch (err) {
        console.error('Failed to fetch top rated content:', err);
      }
    }
  }
};
