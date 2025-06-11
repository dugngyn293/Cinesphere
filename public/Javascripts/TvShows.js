export const TvShows = {
    template: `
      <section class="tv-shows">
        <div class="container">
          <h2 class="h2 section-title">TV Shows</h2>
  
          <!-- Category Filter -->
          <ul class="filter-list">
            <li v-for="category in categories" :key="category">
              <button 
                class="filter-btn" 
                :class="{ active: selectedCategory === category }" 
                @click="selectCategory(category)">
                {{ category }}
              </button>
            </li>
          </ul>
  
          <!-- TV Shows List -->
          <ul class="shows-list">
            <li v-for="show in filteredShows" :key="show.id">
              <div class="show-card" @click="openShow(show)">
                <img :src="show.poster" :alt="show.title" class="show-poster" />
                <div class="show-info">
                  <h3 class="show-title">{{ show.title }}</h3>
                  <p class="show-details">{{ show.year }} | {{ show.genre }}</p>
                  <p class="show-rating">Rating: {{ show.rating }}</p>
                </div>
              </div>
            </li>
          </ul>

          <!-- Tv Show Details Modal -->
          <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content" :style="{ backgroundImage: 'url(' + selectedShow.poster + ')', backgroundSize: 'cover', backgroundPosition: 'center' }">
              <button class="modal-close" @click="closeModal">&times;</button>
              <img :src="selectedShow.poster" :alt="selectedShow.title" class="modal-poster" />
              <h3>{{ selectedShow.title }}</h3>
              <p>{{ selectedShow.year }} | {{ selectedShow.genre }}</p>
              <p>Rating: {{ selectedShow.rating }}</p>
              <p>{{ selectedShow.description }}</p>
              <button class="play-btn">▶ Play Show</button>
            </div>
          </div>
        </div>
      </section>
    `,
    data() {
      return {
        categories: ['Drama', 'Comedy', 'Action', 'Sci-Fi', 'Documentary'],
        selectedCategory: 'Drama',
        showModal: false,
        selectedShow: {},
        tvShows: [
          // Drama
          { id: 1, title: 'Breaking Bad', year: '2008', genre: 'Drama', poster: '../images/tv-shows-page/breaking-bad.jpg', rating: '9.5', category: 'Drama',
            description: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family's future."},
          { id: 2, title: 'The Crown', year: '2016', genre: 'Drama', poster: '../images/tv-shows-page/the-crown.jpg', rating: '8.6', category: 'Drama',
            description: "Follows the political rivalries and romances of Queen Elizabeth II's reign and the events that shaped Britain for the second half of the 20th century."},
          { id: 3, title: 'The Sopranos', year: '1999', genre: 'Drama', poster: '../images/tv-shows-page/the-sopranos.jpg', rating: '9.2', category: 'Drama',
            description: "New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life that affect his mental state, leading him to seek professional psychiatric counseling."},
          // Comedy
          { id: 4, title: 'Friends', year: '1994', genre: 'Comedy', poster: '../images/tv-shows-page/friends.jpg', rating: '8.9', category: 'Comedy',
            description: "Follows the personal and professional lives of six twenty to thirty year-old friends living in the Manhattan borough of New York City."},
          { id: 5, title: 'Brooklyn Nine-Nine', year: '2013', genre: 'Comedy', poster: '../images/tv-shows-page/brooklyn99.jpg', rating: '8.4', category: 'Comedy',
            description: "Comedy series following the exploits of Det. Jake Peralta and his diverse, lovable colleagues as they police the NYPD's 99th Precinct."},
          { id: 6, title: 'The Office', year: '2005', genre: 'Comedy', poster: '../images/tv-shows-page/the-office.jpg', rating: '9.0', category: 'Comedy',
            description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, tedium and romance."},
          // Action
          { id: 7, title: 'Game of Thrones', year: '2011', genre: 'Action', poster: '../images/tv-shows-page/game-of-thrones.jpg', rating: '9.3', category: 'Action',
            description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia."},
          { id: 8, title: 'The Last of Us', year: '2023', genre: 'Action', poster: '../images/tv-shows-page/the-last-of-us.jpg', rating: '8.8', category: 'Action',
            description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope."},
          { id: 9, title: 'Vikings', year: '2013', genre: 'Action', poster: '../images/tv-shows-page/vikings.jpg', rating: '8.5', category: 'Action',
            description: "Vikings transports us to the brutal and mysterious world of Ragnar Lothbrok, a Viking warrior and farmer who yearns to explore--and raid--the distant shores across the ocean."},
          // Sci-Fi
          { id: 10, title: 'Stranger Things', year: '2016', genre: 'Sci-Fi', poster: '../images/tv-shows-page/stranger-things.jpg', rating: '8.7', category: 'Sci-Fi',
            description: "In 1980s Indiana, a group of young friends witness supernatural forces and secret government exploits. As they search for answers, the children unravel a series of extraordinary mysteries."},
          { id: 11, title: 'Black Mirror', year: '2011', genre: 'Sci-Fi', poster: '../images/tv-shows-page/black-mirror.jpg', rating: '8.8', category: 'Sci-Fi',
            description: "Featuring stand-alone dramas -- sharp, suspenseful, satirical tales that explore techno-paranoia -- 'Black Mirror' is a contemporary reworking of 'The Twilight Zone' with stories that tap into the collective unease about the modern world."},
          { id: 12, title: 'The Mandalorian', year: '2019', genre: 'Sci-Fi', poster: '../images/tv-shows-page/mandalorian.jpg', rating: '8.7', category: 'Sci-Fi',
            description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic."},
          // Documentary
          { id: 13, title: 'Planet Earth', year: '2006', genre: 'Documentary', poster: '../images/tv-shows-page/planet-earth.jpg', rating: '9.4', category: 'Documentary',
            description: "A documentary series on the wildlife found on Earth. Each episode covers a different habitat: deserts, mountains, deep oceans, shallow seas, forests, caves, polar regions, fresh water, plains and jungles. Narrated by David Attenborough."},
          { id: 14, title: 'Our Planet', year: '2019', genre: 'Documentary', poster: '../images/tv-shows-page/our-planet.jpg', rating: '9.3', category: 'Documentary',
            description: "Explores and unravels the mystery of how and why animals migrate, showing some of the most dramatic and compelling stories in the natural world through spectacular and innovative cinematography."},
          { id: 15, title: 'Making a Murderer', year: '2015', genre: 'Documentary', poster: '../images/tv-shows-page/making-a-murderer.jpg', rating: '8.6', category: 'Documentary',
            description: "Filmed over a 10-year period, Steven Avery, a DNA exoneree who, while in the midst of exposing corruption in local law enforcement, finds himself the prime suspect in a grisly new crime."}
        ]
      };
    },
    computed: {
      filteredShows() {
        return this.tvShows.filter(show => show.category === this.selectedCategory);
      }
    },
    methods: {
      selectCategory(category) {
        this.selectedCategory = category;
      },
      openShow(show) {
        this.selectedShow = show;
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      }
    }
  };