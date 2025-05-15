// TV Series Component

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
              <MovieCard :movie="series" />
            </li>
          </ul>

          <button class="scroll-btn right" @click="scrollRight">→</button>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      tvSeries: [
        {
          id: 1,
          title: 'Moon Knight',
          year: '2022',
          poster: './assets/images/series-1.png',
          quality: '2K',
          duration: '47 min',
          durationISO: 'PT47M',
          rating: '8.6'
        },
        {
          id: 2,
          title: 'Halo',
          year: '2022',
          poster: './assets/images/series-2.png',
          quality: '2K',
          duration: '59 min',
          durationISO: 'PT59M',
          rating: '8.8'
        },
        {
          id: 3,
          title: 'Vikings: Valhalla',
          year: '2022',
          poster: './assets/images/series-3.png',
          quality: '2K',
          duration: '51 min',
          durationISO: 'PT51M',
          rating: '8.3'
        },
        {
          id: 4,
          title: 'Money Heist',
          year: '2017',
          poster: './assets/images/series-4.png',
          quality: '4K',
          duration: '70 min',
          durationISO: 'PT70M',
          rating: '8.3'
        },
        {
          id: 4,
          title: 'Money Heist',
          year: '2017',
          poster: './assets/images/series-4.png',
          quality: '4K',
          duration: '70 min',
          durationISO: 'PT70M',
          rating: '8.3'
        },
        {
          id: 4,
          title: 'Money Heist',
          year: '2017',
          poster: './assets/images/series-4.png',
          quality: '4K',
          duration: '70 min',
          durationISO: 'PT70M',
          rating: '8.3'
        },
        {
          id: 4,
          title: 'Money Heist',
          year: '2017',
          poster: './assets/images/series-4.png',
          quality: '4K',
          duration: '70 min',
          durationISO: 'PT70M',
          rating: '8.3'
        },
        {
          id: 4,
          title: 'Money Heist',
          year: '2017',
          poster: './assets/images/series-4.png',
          quality: '4K',
          duration: '70 min',
          durationISO: 'PT70M',
          rating: '8.3'
        },
      ]
    };
  },
  methods: {
    scrollLeft() {
      this.$refs.scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
    },
    scrollRight() {
      this.$refs.scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
};