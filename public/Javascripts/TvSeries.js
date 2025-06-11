import { MovieCard } from './MovieCard.js';

export const TvSeries = {
  components: {
    MovieCard
  },
  template: `
    <section class="tv-series">
      <div class="container">
        <p class="section-subtitle">Best TV Series</p>
        <h2 class="h2 section-title">World Best TV Series</h2>

        <div class="scroll-wrapper">
          <button class="scroll-btn left" @click="scrollLeft">←</button>

          <ul class="movies-list" ref="scrollContainer">
            <li v-for="series in tvSeries" :key="series.id">
              <MovieCard :movie="series" @open-detail="goToDetail" />
            </li>
          </ul>

          <button class="scroll-btn right" @click="scrollRight">→</button>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      tvSeries: []
    };
  },
  mounted() {
    this.fetchTopTvSeries();
  },
  methods: {
    scrollLeft() {
      this.$refs.scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
    },
    scrollRight() {
      this.$refs.scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
    },
    goToDetail(id) {
      window.location.href = `./MovieDetail.html?id=${id}`;
    },
    async fetchTopTvSeries() {
      const apiKey = '6c90413a736469cc0670b634e5f3f7c1';
      const url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        this.tvSeries = (data.results || []).slice(0, 10).map((tv) => ({
          id: tv.id,
          title: tv.name,
          year: tv.first_air_date ? tv.first_air_date.slice(0, 4) : 'N/A',
          poster: tv.poster_path
            ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
            : null,
          quality: this.randomQuality(),
          duration: 'N/A',
          durationISO: '',
          rating: tv.vote_average ? tv.vote_average.toFixed(1) : 'NR',
          overview: tv.overview || 'No description available.'
        }));
      } catch (error) {
        console.error('error', error);
      }
    },
    randomQuality() {
      const qualities = ['HD', '2K', '4K'];
      return qualities[Math.floor(Math.random() * qualities.length)];
    }
  }
};
