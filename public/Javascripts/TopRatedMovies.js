// Top Rated Movies Component
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
            <MovieCard :movie="movie" />
          </li>
        </ul>
      </div>
    </section>
  `,
  data() {
    return {
      filters: ['Movies', 'TV Shows', 'Documentary', 'Sports'],
      topRatedMovies: [
        {
          id: 1,
          title: 'Sonic the Hedgehog 2',
          year: '2022',
          poster: './assets/images/movie-1.png',
          quality: '2K',
          duration: '122 min',
          durationISO: 'PT122M',
          rating: '7.8'
        },
        {
          id: 2,
          title: 'Morbius',
          year: '2022',
          poster: './assets/images/movie-2.png',
          quality: 'HD',
          duration: '104 min',
          durationISO: 'PT104M',
          rating: '5.9'
        },
        {
          id: 3,
          title: 'The Adam Project',
          year: '2022',
          poster: './assets/images/movie-3.png',
          quality: '4K',
          duration: '106 min',
          durationISO: 'PT106M',
          rating: '7.0'
        },
        {
          id: 4,
          title: 'Free Guy',
          year: '2021',
          poster: './assets/images/movie-4.png',
          quality: '4K',
          duration: '115 min',
          durationISO: 'PT115M',
          rating: '7.7'
        },
        {
          id: 5,
          title: 'The Batman',
          year: '2022',
          poster: './assets/images/movie-5.png',
          quality: '4K',
          duration: '176 min',
          durationISO: 'PT176M',
          rating: '7.9'
        },
        {
          id: 6,
          title: 'Uncharted',
          year: '2022',
          poster: './assets/images/movie-6.png',
          quality: 'HD',
          duration: '116 min',
          durationISO: 'PT116M',
          rating: '7.0'
        },
        {
          id: 7,
          title: 'Death on the Nile',
          year: '2022',
          poster: './assets/images/movie-7.png',
          quality: '2K',
          duration: '127 min',
          durationISO: 'PT127M',
          rating: '6.5'
        },
        {
          id: 8,
          title: "The King's Man",
          year: '2021',
          poster: './assets/images/movie-8.png',
          quality: 'HD',
          duration: '131 min',
          durationISO: 'PT131M',
          rating: '7.0'
        }
      ]
    }
  }
};