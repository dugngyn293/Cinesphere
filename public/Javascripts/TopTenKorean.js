import { MovieCard } from './MovieCard.js';
import { SectionTitle } from './SectionTitle.js';

export const TopTenKorean = {
  components: {
    MovieCard,
    SectionTitle
  },
  template: `
    <section class="upcoming">
      <div class="container">
        <SectionTitle
          title="Top 10 Korean"
          :showFilters="true"
          @filter-selected="handleFilter"
        />

        <div class="slider-wrapper">
          <button class="slider-btn left" @click="scrollLeft">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>

          <ul class="movies-list has-scrollbar" ref="koreanSlider">
            <li v-for="item in topKoreanContent" :key="item.id">
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
      topKoreanContent: [],
      selectedFilter: 'Movies'
    };
  },
  mounted() {
    this.fetchTopKoreanContent();
  },
  methods: {
    scrollLeft() {
      this.$refs.koreanSlider.scrollLeft -= 400;
    },
    scrollRight() {
      this.$refs.koreanSlider.scrollLeft += 400;
    },
    goToDetail(id) {
      window.location.href = `./MovieDetail.html?id=${id}`;
    },
    handleFilter(filter) {
      if (this.selectedFilter !== filter) {
        this.selectedFilter = filter;
        this.fetchTopKoreanContent();
      }
    },
    async fetchTopKoreanContent() {
      const apiKey = '6c90413a736469cc0670b634e5f3f7c1';
      let url = '';

      if (this.selectedFilter === 'TV Shows') {
        url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_origin_country=KR&sort_by=vote_average.desc&vote_count.gte=100&language=en-US`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_origin_country=KR&sort_by=vote_average.desc&vote_count.gte=100&language=en-US`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        this.topKoreanContent = (data.results || []).slice(0, 10).map((item) => {
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
            quality: this.randomQuality(),
            duration: 'N/A',
            durationISO: '',
            rating: item.vote_average ? item.vote_average.toFixed(1) : 'NR',
            overview: item.overview || 'No description available.'
          };
        });
      } catch (error) {
        console.error('Error fetching Korean content:', error);
      }
    },
    randomQuality() {
      const qualities = ['HD', '2K', '4K'];
      return qualities[Math.floor(Math.random() * qualities.length)];
    }
  }
};
