export const Movies = {
    template: `
      <section class="movies-page">
        <div class="container">
          <h2 class="h2 section-title">Movies</h2>
  
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
  
          <!-- Movies List -->
          <ul class="shows-list">
            <li v-for="movie in filteredMovies" :key="movie.id">
              <div class="show-card" @click="openMovie(movie)">
                <img :src="movie.poster" :alt="movie.title" class="show-poster" />
                <div class="show-info">
                  <h3 class="show-title">{{ movie.title }}</h3>
                  <p class="show-details">{{ movie.year }} | {{ movie.genre }}</p>
                  <p class="show-rating">Rating: {{ movie.rating }}</p>
                </div>
              </div>
            </li>
          </ul>

          <!-- Movie Details Modal -->
          <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content" :style="{ backgroundImage: 'url(' + selectedMovie.poster + ')', backgroundSize: 'cover', backgroundPosition: 'center' }">
              <button class="modal-close" @click="closeModal">&times;</button>
              <img :src="selectedMovie.poster" :alt="selectedMovie.title" class="modal-poster" />
              <h3>{{ selectedMovie.title }}</h3>
              <p>{{ selectedMovie.year }} | {{ selectedMovie.genre }}</p>
              <p>Rating: {{ selectedMovie.rating }}</p>
              <p>{{ selectedMovie.description }}</p>
              <button class="play-btn">▶ Play Movie</button>
            </div>
          </div>
        </div>
      </section>
    `,
    data() {
      return {
        categories: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Animation'],
        selectedCategory: 'Action',
        showModal: false,
        selectedMovie: {},
        movies: [
          // Action
          { id: 1, title: 'Inception', year: '2010', genre: 'Action', poster: '../images/movies-page/inception.jpg', rating: '8.8', category: 'Action', 
            description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.'},
          { id: 2, title: 'Mad Max: Fury Road', year: '2015', genre: 'Action', poster: '../images/movies-page/mad-max.jpg', rating: '8.1', category: 'Action',
            description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshipper and a drifter named Max.'},
          { id: 3, title: 'John Wick', year: '2014', genre: 'Action', poster: '../images/movies-page/john-wick.jpg', rating: '7.4', category: 'Action', 
            description: 'John Wick is a former hitman grieving the loss of his true love. When his home is broken into, robbed, and his dog killed, he is forced to return to action to exact revenge.'},
          // Comedy
          { id: 4, title: 'The Hangover', year: '2009', genre: 'Comedy', poster: '../images/movies-page/the-hangover.jpg', rating: '7.7', category: 'Comedy',
            description: 'Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night and the bachelor missing. They must make their way around the city in order to find their friend in time for his wedding.'},
          { id: 5, title: 'Superbad', year: '2007', genre: 'Comedy', poster: '../images/movies-page/superbad.jpg', rating: '7.6', category: 'Comedy',
            description: 'Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.'},
          { id: 6, title: 'Step Brothers', year: '2008', genre: 'Comedy', poster: '../images/movies-page/step-brothers.jpg', rating: '6.9', category: 'Comedy',
            description: 'Two aimless middle-aged losers still living at home are forced against their will to become roommates when their parents marry.'},
          // Drama
          { id: 7, title: 'Forrest Gump', year: '1994', genre: 'Drama', poster: '../images/movies-page/forrest-gump.jpg', rating: '8.8', category: 'Drama',
            description: 'The history of the United States from the 1950s to the 70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.'},
          { id: 8, title: 'The Shawshank Redemption', year: '1994', genre: 'Drama', poster: '../images/movies-page/shawshank-redemption.jpg', rating: '9.3', category: 'Drama',
            description: 'A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.'},
          { id: 9, title: 'Fight Club', year: '1999', genre: 'Drama', poster: '../images/movies-page/fight-club.jpg', rating: '8.8', category: 'Drama',
            description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.'},
          // Sci-Fi
          { id: 10, title: 'Interstellar', year: '2014', genre: 'Sci-Fi', poster: '../images/movies-page/interstellar.jpg', rating: '8.6', category: 'Sci-Fi',
            description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.'},
          { id: 11, title: 'The Matrix', year: '1999', genre: 'Sci-Fi', poster: '../images/movies-page/the-matrix.jpg', rating: '8.7', category: 'Sci-Fi',
            description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.'},
          { id: 12, title: 'Blade Runner 2049', year: '2017', genre: 'Sci-Fi', poster: '../images/movies-page/blade-runner-2049.jpg', rating: '8.0', category: 'Sci-Fi',
            description: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years."},
          // Animation
          { id: 13, title: 'Spirited Away', year: '2001', genre: 'Animation', poster: '../images/movies-page/spirited-away.jpg', rating: '8.6', category: 'Animation',
            description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches and spirits, and where humans are changed into beasts."},
          { id: 14, title: 'Toy Story', year: '1995', genre: 'Animation', poster: '../images/movies-page/toy-story.jpg', rating: '8.3', category: 'Animation',
            description: "A cowboy doll is profoundly jealous when a new spaceman action figure supplants him as the top toy in a boy's bedroom. When circumstances separate them from their owner, the duo have to put aside their differences to return to him."},
          { id: 15, title: 'Coco', year: '2017', genre: 'Animation', poster: '../images/movies-page/coco.jpg', rating: '8.4', category: 'Animation',
            description: "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer."}
        ]
      };
    },
    computed: {
      filteredMovies() {
        return this.movies.filter(movie => movie.category === this.selectedCategory);
      }
    },
    methods: {
      selectCategory(category) {
        this.selectedCategory = category;
      },
      openMovie(movie) {
        this.selectedMovie = movie;
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      }
    }
  };