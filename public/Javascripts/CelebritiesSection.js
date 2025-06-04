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
      celebrities: []
    };
  },
  mounted() {
    this.fetchCelebrities();
  },
  methods: {
    scrollLeft() {
      this.$refs.celebritySlider.scrollLeft -= 400;
    },
    scrollRight() {
      this.$refs.celebritySlider.scrollLeft += 400;
    },
    async fetchCelebrities() {
      const apiKey = '510215c9eeaff8af2bc03a26010d9bbb';
      const url = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US&page=1`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        this.celebrities = (data.results || []).slice(0, 10).map(person => ({
          id: person.id,
          title: person.name,
          year: 'Known for: ' + (person.known_for_department || 'N/A'),
          poster: person.profile_path
            ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
            : null,
          quality: 'Popular',
          duration: '',
          durationISO: '',
          rating: person.popularity.toFixed(1)
        }));
      } catch (error) {
        console.error('Error fetching celebrities:', error);
      }
    }
  }
};
