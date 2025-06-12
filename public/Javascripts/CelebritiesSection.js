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
        <SectionTitle
          title="Celebrities"
          @filter-selected="handleFilter"
        />

        <div class="slider-wrapper">
          <button class="slider-btn left" @click="scrollLeft">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>

          <ul class="movies-list has-scrollbar" ref="celebritySlider">
            <li
              v-for="celebrity in filteredCelebrities"
              :key="celebrity.id"
              class="movie-item"
            >
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
      celebrities: [],
      selectedFilter: 'Movies'
    };
  },
  computed: {
    filteredCelebrities() {
      const type = this.selectedFilter === 'TV Shows' ? 'tv' : 'movie';
      return this.celebrities.filter((person) =>
        person.knownForMediaTypes.includes(type)
      );
    }
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
    handleFilter(filter) {
      this.selectedFilter = filter;
    },
    async fetchCelebrities() {
      const apiKey = '510215c9eeaff8af2bc03a26010d9bbb';
      const url = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US&page=1`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        this.celebrities = (data.results || []).slice(0, 20).map((person) => {
          const knownForTypes = (person.known_for || []).map((media) => media.media_type);

          return {
            id: person.id,
            title: person.name,
            year: person.known_for_department
              ? `Known for: ${person.known_for_department}`
              : 'Known for: N/A',
            poster: person.profile_path
              ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
              : null,
            quality: 'Popular',
            duration: '',
            durationISO: '',
            rating: person.popularity ? person.popularity.toFixed(1) : 'N/A',
            knownForMediaTypes: knownForTypes
          };
        });
      } catch (error) {
        console.error('Error fetching celebrities:', error);
      }
    }
  }
};
