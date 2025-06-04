import { MovieCard } from './MovieCard.js';

export const SearchResult = {
    props: ['query'],
    components: {
        MovieCard
    },
    data() {
        return {
            results: [],
            isLoading: true
        };
    },
    async mounted() {
        try {
            const res = await fetch(`/api/search?query=${encodeURIComponent(this.query)}`);
            const data = await res.json();

            // change the structure of results to match the MovieCard component
            this.results = data.results.map((movie) => ({
                id: movie.id,
                title: movie.title,
                poster: 'https://image.tmdb.org/t/p/w500' + movie.poster_path,
                year: movie.release_date?.split('-')[0] || 'N/A',
                duration: '120 min',
                durationISO: 'PT2H',
                quality: 'HD',
                rating: movie.vote_average?.toFixed(1) || 'N/A'
            }));

        } catch (err) {
            console.error('Search fetch error:', err);
        } finally {
            this.isLoading = false;
        }
    },
    template: `
    <section class="search-results container">
      <h2 class="section-title">Search Results for "{{ query }}"</h2>

      <div v-if="isLoading">Loading...</div>
      <div v-else-if="results.length === 0">No movies found.</div>

      <div class="grid-list">
        <MovieCard
          v-for="movie in results"
          :key="movie.id"
          :movie="movie"
        />
      </div>
    </section>
  `
};
