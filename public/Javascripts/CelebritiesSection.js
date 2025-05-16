// Top celebrities
import { MovieCard } from './MovieCard.js';
import { SectionTitle } from './SectionTitle.js';


export const CelebritiesSection = {
  components: {
    MovieCard,
    SectionTitle
  },
  template: `
    <section class="upcoming">
      <div class="container">
        <SectionTitle title="Celebrities" />

        <div class="slider-wrapper">
          <button class="slider-btn left" @click="scrollLeft">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>

          <ul class="movies-list has-scrollbar" ref="celebritySlider">
            <li v-for="celebrity in celebrities" :key="celebrity.id" class="movie-item">
              <MovieCard :movie="celebrity" />
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
      celebrities: [
        {
          id: 1,
          title: 'The Northman',
          year: '2022',
          poster: './assets/images/upcoming-1.png',
          quality: 'HD',
          duration: '137 min',
          durationISO: 'PT137M',
          rating: '8.5'
        },
        {
          id: 2,
          title: 'Doctor Strange in the Multiverse of Madness',
          year: '2022',
          poster: './assets/images/upcoming-2.png',
          quality: '4K',
          duration: '126 min',
          durationISO: 'PT126M',
          rating: 'NR'
        },
        {
          id: 3,
          title: 'Memory',
          year: '2022',
          poster: './assets/images/upcoming-3.png',
          quality: '2K',
          duration: 'N/A',
          durationISO: '',
          rating: 'NR'
        },
        {
          id: 4,
          title: 'The Unbearable Weight of Massive Talent',
          year: '2022',
          poster: './assets/images/upcoming-4.png',
          quality: 'HD',
          duration: '107 min',
          durationISO: 'PT107M',
          rating: 'NR'
        },{
          id: 4,
          title: 'The Unbearable Weight of Massive Talent',
          year: '2022',
          poster: './assets/images/upcoming-4.png',
          quality: 'HD',
          duration: '107 min',
          durationISO: 'PT107M',
          rating: 'NR'
        },
        {
          id: 4,
          title: 'The Unbearable Weight of Massive Talent',
          year: '2022',
          poster: './assets/images/upcoming-4.png',
          quality: 'HD',
          duration: '107 min',
          durationISO: 'PT107M',
          rating: 'NR'
        },
      ]
    };
  },
  methods: {
    scrollLeft() {
      this.$refs.celebritySlider.scrollLeft -= 400;
    },
    scrollRight() {
      this.$refs.celebritySlider.scrollLeft += 400;
    }
  }
};