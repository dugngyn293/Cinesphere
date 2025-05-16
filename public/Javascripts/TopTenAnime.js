
import { MovieCard } from './MovieCard.js';
import { SectionTitle } from './SectionTitle.js';

// Top Ten Anime Component
export const TopTenAnime = {
  components: {
    MovieCard,
    SectionTitle
  },
  template: `
    <section class="upcoming">
      <div class="container">
        <SectionTitle title="Top 10 Anime All Times" />

        <div class="slider-wrapper">
          <button class="slider-btn left" @click="scrollLeft">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>

          <ul class="movies-list has-scrollbar" ref="animeSlider">
            <li v-for="anime in topAnime" :key="anime.id">
              <MovieCard :movie="anime" />
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
      topAnime: [
        {
          id: 1,
          title: 'Demon Slayer',
          year: '2022',
          poster: './assets/images/Demon Slayer.jpeg',
          quality: 'HD',
          duration: '137 min',
          durationISO: 'PT137M',
          rating: '8.5'
        },
        {
          id: 2,
          title: 'Akame ga Kill',
          year: '2022',
          poster: './assets/images/Akame ga Kill!.jpeg',
          quality: '4K',
          duration: '126 min',
          durationISO: 'PT126M',
          rating: 'NR'
        },
        {
          id: 3,
          title: 'Black Clover',
          year: '2022',
          poster: './assets/images/black-clover.jpeg', // fix path here if needed
          quality: '2K',
          duration: 'N/A',
          durationISO: '',
          rating: 'NR'
        },
        {
          id: 4,
          title: 'Hunter x Hunter',
          year: '2022',
          poster: './assets/images/Hunter poster.jpeg',
          quality: 'HD',
          duration: '107 min',
          durationISO: 'PT107M',
          rating: 'NR'
        },
        {
          id: 4,
          title: 'Hunter x Hunter',
          year: '2022',
          poster: './assets/images/Hunter poster.jpeg',
          quality: 'HD',
          duration: '107 min',
          durationISO: 'PT107M',
          rating: 'NR'
        },
        {
          id: 4,
          title: 'Hunter x Hunter',
          year: '2022',
          poster: './assets/images/Hunter poster.jpeg',
          quality: 'HD',
          duration: '107 min',
          durationISO: 'PT107M',
          rating: 'NR'
        },
        {
          id: 4,
          title: 'Hunter x Hunter',
          year: '2022',
          poster: './assets/images/Hunter poster.jpeg',
          quality: 'HD',
          duration: '107 min',
          durationISO: 'PT107M',
          rating: 'NR'
        }
      ]
    };
  },
  methods: {
    scrollLeft() {
      this.$refs.animeSlider.scrollLeft -= 400;
    },
    scrollRight() {
      this.$refs.animeSlider.scrollLeft += 400;
    }
  }
};
