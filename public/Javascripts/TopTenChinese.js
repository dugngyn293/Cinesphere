import { MovieCard } from './MovieCard.js';
import { SectionTitle } from './SectionTitle.js';

export const TopTenChinese = {
  components: {
    MovieCard,
    SectionTitle
  },
  template: `
    <section class="upcoming">
      <div class="container">
        <SectionTitle title="Top 10 Chinese" />

        <div class="slider-wrapper">
          <button class="slider-btn left" @click="scrollLeft">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>

          <ul class="movies-list has-scrollbar" ref="chineseSlider">
            <li v-for="movie in topChineseMovies" :key="movie.id">
              <MovieCard :movie="movie" @open-detail="goToDetail" />
            </li>
          </ul>

          <button class="slider-btn right" @click="scrollRight">
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      topChineseMovies: []
    };
  },
  mounted() {
    this.fetchTopChineseMovies();
  },
  methods: {
    scrollLeft() {
      this.$refs.chineseSlider.scrollLeft -= 400;
    },
    scrollRight() {
      this.$refs.chineseSlider.scrollLeft += 400;
    },
    goToDetail(id) {
      window.location.href = `./MovieDetail.html?id=${id}`;
    },
    async fetchTopChineseMovies() {
      const apiKey = '6c90413a736469cc0670b634e5f3f7c1';
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_origin_country=CN&sort_by=vote_average.desc&vote_count.gte=100&language=en-US`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        this.topChineseMovies = (data.results || []).slice(0, 10).map((movie) => ({
          id: movie.id,
          title: movie.title,
          year: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
          quality: this.randomQuality(),
          duration: 'N/A',
          durationISO: '',
          rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'NR',
          overview: movie.overview || 'No description available.'
        }));

      } catch (error) {
        console.error('Error fetching Chinese movies:', error);
      }
    },
    randomQuality() {
      const qualities = ['HD', '2K', '4K'];
      return qualities[Math.floor(Math.random() * qualities.length)];
    }
  }
};
