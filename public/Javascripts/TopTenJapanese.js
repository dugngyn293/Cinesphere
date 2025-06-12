import { MovieCard } from './MovieCard.js';
import { SectionTitle } from './SectionTitle.js';

export const TopTenJapanese = {
  components: {
    MovieCard,
    SectionTitle
  },
  template: `
    <section class="upcoming">
      <div class="container">
        <SectionTitle
          title="Top 10 Japanese"
          :showFilters="true"
          @filter-selected="handleFilter"
        />

        <div class="slider-wrapper">
          <button class="slider-btn left" @click="scrollLeft">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>

          <ul class="movies-list has-scrollbar" ref="japaneseSlider">
            <li v-for="item in topJapanese" :key="item.id">
              <MovieCard :movie="item" @open-detail="goToDetail" />
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
      topJapanese: [],
      selectedFilter: 'Movies'
    };
  },
  mounted() {
    this.fetchTopJapaneseContent();
  },
  methods: {
    scrollLeft() {
      this.$refs.japaneseSlider.scrollLeft -= 400;
    },
    scrollRight() {
      this.$refs.japaneseSlider.scrollLeft += 400;
    },
    goToDetail(id) {
      window.location.href = `./MovieDetail.html?id=${id}`;
    },
    handleFilter(filter) {
      if (this.selectedFilter !== filter) {
        this.selectedFilter = filter;
        this.fetchTopJapaneseContent();
      }
    },
    async fetchTopJapaneseContent() {
      const apiKey = '6c90413a736469cc0670b634e5f3f7c1';
      let url = '';

      if (this.selectedFilter === 'TV Shows') {
        url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_origin_country=JP&sort_by=vote_average.desc&vote_count.gte=100&language=en-US`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_origin_country=JP&sort_by=vote_average.desc&vote_count.gte=100&language=en-US`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        this.topJapanese = (data.results || []).slice(0, 10).map((item) => {
          let year = 'N/A';
          if (item.release_date) {
            year = item.release_date.slice(0, 4);
          } else if (item.first_air_date) {
            year = item.first_air_date.slice(0, 4);
          }

          return {
            id: item.id,
            title: item.title || item.name || 'Untitled',
            year,
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
        console.error('Failed to fetch top Japanese content:', err);
      }
    }
  }
};
