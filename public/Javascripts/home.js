import { createApp } from 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js';
import { SignUpForm } from './sign-up.js';
import { SignInForm } from './sign-in.js';
import { UserProfile } from './user-profile.js';

const App = {
  data() {
    return {
      showSignupForm: false,
      showSigninForm: false,
      showProfileForm: false,
    };
  },
  template: `
    <Header 
      @open-signup="showSignupForm = true"
      @open-signin="showSigninForm = true"
      @open-profile="showProfileForm = true" />

    <SignUpForm :visible="showSignupForm" @close="showSignupForm = false" />
    <SignInForm :visible="showSigninForm" @close="showSigninForm = false" />
    <UserProfile :visible="showProfileForm" @close="showProfileForm = false" />
    <main>
      <article>
        <HeroSection />
        <TopTenAllTimes />
        <CelebritiesSection />
        <ServiceSection />
        <TopRatedMovies />
        <TvSeries />
        <TopTenUS />
        <TopTenChinese />
        <TopTenKorean />
        <TopTenAnime />
        <CtaSection />
      </article>
    </main>
    <Footer />
    <GoToTop />
  `
};

// Header Component
const Header = {
  template: `
    <header class="header" :class="{ active: isMenuActive }">
      <div class="container">
        <div class="overlay" :class="{ active: isMenuActive }" @click="closeMenu"></div>

        <a href="./index.html" class="logo">
          <img src="./assets/images/logo.svg" alt="Filmlane logo">
        </a>

        <div class="header-actions">
          <button class="search-btn">
            <ion-icon name="search-outline"></ion-icon>
          </button>

          <div class="lang-wrapper">
            <label for="language">
              <ion-icon name="globe-outline"></ion-icon>
            </label>

            <select name="language" id="language" v-model="selectedLanguage">
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
            </select>
          </div>

          <button class="btn btn-primary" @click="$emit('open-signin')">Sign in</button>

          <button class="btn btn-primary" @click="$emit('open-signup')">Sign up</button>
          <div class="settings-button">
            <img src="/images/avatar-default.png" class="user-avatar" @click="$emit('open-profile')" />
          </div>
        </div>

        <button class="menu-open-btn" @click="openMenu">
          <ion-icon name="reorder-two"></ion-icon>
        </button>

        <nav class="navbar" :class="{ active: isMenuActive }">
          <div class="navbar-top">
            <a href="./index.html" class="logo">
              <img src="./assets/images/logo.svg" alt="Filmlane logo">
            </a>

            <button class="menu-close-btn" @click="closeMenu">
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>

          <ul class="navbar-list">
            <li v-for="item in navItems" :key="item.text">
              <a :href="item.link" class="navbar-link">{{ item.text }}</a>
            </li>
          </ul>

          <ul class="navbar-social-list">
            <li v-for="social in socialMedia" :key="social.icon">
              <a :href="social.link" class="navbar-social-link">
                <ion-icon :name="social.icon"></ion-icon>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  data() {
    return {
      isMenuActive: false,
      selectedLanguage: 'en',
      languages: [
        { code: 'en', name: 'EN' },
        { code: 'au', name: 'AU' },
        { code: 'ar', name: 'AR' },
        { code: 'tu', name: 'TU' }
      ],
      navItems: [
        { text: 'Home', link: '../guests/index.html' },
        { text: 'Movie', link: '#' },
        { text: 'Tv Show', link: '#' },
        { text: 'Web Series', link: '#' },
        { text: 'Pricing', link: '#' }
      ],
      socialMedia: [
        { icon: 'logo-twitter', link: '#' },
        { icon: 'logo-facebook', link: '#' },
        { icon: 'logo-pinterest', link: '#' },
        { icon: 'logo-instagram', link: '#' },
        { icon: 'logo-youtube', link: '#' }
      ]
    }
  },
  methods: {
    openMenu() {
      this.isMenuActive = true;
    },
    closeMenu() {
      this.isMenuActive = false;
    }
  }
};

// Hero Section Component
const HeroSection = {
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <p class="hero-subtitle">Filmlane</p>

          <h1 class="h1 hero-title">
            Unlimited <strong>Movie</strong>, TVs Shows, & More.
          </h1>

          <div class="meta-wrapper">
            <div class="badge-wrapper">
              <div class="badge badge-fill">PG 18</div>
              <div class="badge badge-outline">HD</div>
            </div>

            <div class="ganre-wrapper">
              <a href="#" v-for="(genre, index) in genres" :key="genre">
                {{ genre }}{{ index < genres.length - 1 ? ',' : '' }}
              </a>
            </div>

            <div class="date-time">
              <div>
                <ion-icon name="calendar-outline"></ion-icon>
                <time datetime="2022">{{ releaseYear }}</time>
              </div>

              <div>
                <ion-icon name="time-outline"></ion-icon>
                <time datetime="PT128M">{{ duration }}</time>
              </div>
            </div>
          </div>

          <button class="btn btn-primary">
            <ion-icon name="play"></ion-icon>
            <span>Watch now</span>
          </button>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      genres: ['Romance', 'Drama'],
      releaseYear: '2022',
      duration: '128 min'
    }
  }
};

// Movie Card Component
const MovieCard = {
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="movie-card">
      <a href="./movie-details.html">
        <figure class="card-banner">
          <img :src="movie.poster" :alt="movie.title + ' movie poster'">
        </figure>
      </a>

      <div class="title-wrapper">
        <a href="./movie-details.html">
          <h3 class="card-title">{{ movie.title }}</h3>
        </a>
        <time :datetime="movie.year">{{ movie.year }}</time>
      </div>

      <div class="card-meta">
        <div class="badge badge-outline">{{ movie.quality }}</div>

        <div class="duration">
          <ion-icon name="time-outline"></ion-icon>
          <time :datetime="movie.durationISO">{{ movie.duration }}</time>
        </div>

        <div class="rating">
          <ion-icon name="star"></ion-icon>
          <data>{{ movie.rating }}</data>
        </div>
      </div>
    </div>
  `
};

// Section Title Component
const SectionTitle = {
  props: {
    subtitle: {
      type: String,
      default: 'Online Streaming'
    },
    title: {
      type: String,
      required: true
    },
    showFilters: {
      type: Boolean,
      default: true
    }
  },
  template: `
    <div class="flex-wrapper">
      <div class="title-wrapper">
        <p class="section-subtitle">{{ subtitle }}</p>
        <h2 class="h2 section-title">{{ title }}</h2>
      </div>

      <ul class="filter-list" v-if="showFilters">
        <li v-for="filter in filters" :key="filter">
          <button class="filter-btn">{{ filter }}</button>
        </li>
      </ul>
    </div>
  `,
  data() {
    return {
      filters: ['Movies', 'TV Shows', 'Anime']
    }
  }
};

// Top Ten All Times Component
const TopTenAllTimes = {
  components: {
    MovieCard,
    SectionTitle
  },
  template: `
    <section class="upcoming">
      <div class="container">
        <SectionTitle title="Top 10 all times" />
        
        <ul class="movies-list has-scrollbar">
          <li v-for="movie in topMovies" :key="movie.id">
            <MovieCard :movie="movie" />
          </li>
        </ul>
      </div>
    </section>
  `,
  data() {
    return {
      topMovies: [
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
        }
      ]
    }
  }
};

// Celebrities Section Component
const CelebritiesSection = {
  components: {
    MovieCard,
    SectionTitle
  },
  template: `
    <section class="upcoming">
      <div class="container">
        <SectionTitle title="Celebrities" />
        
        <ul class="movies-list has-scrollbar">
          <li v-for="celebrity in celebrities" :key="celebrity.id">
            <MovieCard :movie="celebrity" />
          </li>
        </ul>
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
        }
      ]
    }
  }
};

// Service Section Component
const ServiceSection = {
  template: `
    <section class="service">
      <div class="container">
        <div class="service-banner">
          <figure>
            <img src="./assets/images/service-banner.jpg" alt="HD 4k resolution! only $3.99">
          </figure>

          <a href="./assets/images/service-banner.jpg" download class="service-btn">
            <span>Download</span>
            <ion-icon name="download-outline"></ion-icon>
          </a>
        </div>

        <div class="service-content">
          <p class="service-subtitle">Our Services</p>

          <h2 class="h2 service-title">Download Your Shows Watch Offline.</h2>

          <p class="service-text">
            Lorem ipsum dolor sit amet, consecetur adipiscing elseddo eiusmod tempor.There are many variations of
            passages of lorem Ipsum available, but the majority have suffered alteration in some injected humour.
          </p>

          <ul class="service-list">
            <li v-for="service in services" :key="service.title">
              <div class="service-card">
                <div class="card-icon">
                  <ion-icon :name="service.icon"></ion-icon>
                </div>

                <div class="card-content">
                  <h3 class="h3 card-title">{{ service.title }}</h3>
                  <p class="card-text">{{ service.description }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      services: [
        {
          icon: 'tv',
          title: 'Enjoy on Your TV.',
          description: 'Lorem ipsum dolor sit amet, consecetur adipiscing elit, sed do eiusmod tempor.'
        },
        {
          icon: 'videocam',
          title: 'Watch Everywhere.',
          description: 'Lorem ipsum dolor sit amet, consecetur adipiscing elit, sed do eiusmod tempor.'
        }
      ]
    }
  }
};

// Top Rated Movies Component
const TopRatedMovies = {
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

// TV Series Component
const TvSeries = {
  components: {
    MovieCard
  },
  template: `
    <section class="tv-series">
      <div class="container">
        <p class="section-subtitle">Best TV Series</p>
        <h2 class="h2 section-title">World Best TV Series</h2>

        <ul class="movies-list">
          <li v-for="series in tvSeries" :key="series.id">
            <MovieCard :movie="series" />
          </li>
        </ul>
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
        }
      ]
    }
  }
};

// Top Ten US Component
const TopTenUS = {
  components: {
    MovieCard,
    SectionTitle
  },
  template: `
    <section class="upcoming">
      <div class="container">
        <SectionTitle title="Top 10 US" />
        
        <ul class="movies-list has-scrollbar">
          <li v-for="movie in topUsMovies" :key="movie.id">
            <MovieCard :movie="movie" />
          </li>
        </ul>
      </div>
    </section>
  `,
  data() {
    return {
      topUsMovies: [
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
        }
      ]
    }
  }
};

// Top Ten Chinese Component
const TopTenChinese = {
  components: {
    MovieCard,
    SectionTitle
  },
  template: `
    <section class="upcoming">
      <div class="container">
        <SectionTitle title="Top 10 Chinese" />
        
        <ul class="movies-list has-scrollbar">
          <li v-for="movie in topChineseMovies" :key="movie.id">
            <MovieCard :movie="movie" />
          </li>
        </ul>
      </div>
    </section>
  `,
  data() {
    return {
      topChineseMovies: [
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
        }
      ]
    }
  }
};

// Top Ten Korean Component
const TopTenKorean = {
  components: {
    MovieCard,
    SectionTitle
  },
  template: `
    <section class="upcoming">
      <div class="container">
        <SectionTitle title="Top 10 Korean" />
        
        <ul class="movies-list has-scrollbar">
          <li v-for="movie in topKoreanMovies" :key="movie.id">
            <MovieCard :movie="movie" />
          </li>
        </ul>
      </div>
    </section>
  `,
  data() {
    return {
      topKoreanMovies: [
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
        }
      ]
    }
  }
};

// Top Ten Anime Component
const TopTenAnime = {
  components: {
    MovieCard,
    SectionTitle
  },
  template: `
    <section class="upcoming">
      <div class="container">
        <SectionTitle title="Top 10 Anime all times" />
        
        <ul class="movies-list has-scrollbar">
          <li v-for="anime in topAnime" :key="anime.id">
            <MovieCard :movie="anime" />
          </li>
        </ul>
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
          title: 'Black clover',
          year: '2022',
          poster: './assets/images/jpeg',
          quality: '2K',
          duration: 'N/A',
          durationISO: '',
          rating: 'NR'
        },
        {
          id: 4,
          title: 'Hunter x hunter',
          year: '2022',
          poster: './assets/images/𝐇𝐮𝐧𝐭𝐞𝐫 𝐩𝐨𝐬𝐭𝐞𝐫.jpeg',
          quality: 'HD',
          duration: '107 min',
          durationISO: 'PT107M',
          rating: 'NR'
        }
      ]
    }
  }
};

// CTA Section Component
const CtaSection = {
    template: `
      <section class="cta">
        <div class="container">
          <div class="title-wrapper">
            <h2 class="cta-title">Trial start first 30 days.</h2>
            <p class="cta-text">
              Enter your email to create or restart your membership.
            </p>
          </div>
  
          <form action="" class="cta-form" @submit.prevent="submitForm">
            <input type="email" name="email" v-model="email" required placeholder="Enter your email" class="email-field">
            <button type="submit" class="cta-form-btn">Get started</button>
          </form>
        </div>
      </section>
    `,
    data() {
      return {
        email: ''
      }
    },
    methods: {
      submitForm() {
        console.log('Submitted email:', this.email);
        this.email = '';
        // Here you would typically send the email to your backend
        alert('Thank you for subscribing!');
      }
    }
  };
  
  // Footer Component
  const Footer = {
    template: `
      <footer class="footer">
        <div class="footer-top">
          <div class="container">
            <div class="footer-brand-wrapper">
              <a href="./index.html" class="logo">
                <img src="./assets/images/logo.svg" alt="Filmlane logo">
              </a>
  
              <ul class="footer-list">
                <li v-for="(link, index) in quickLinks" :key="index">
                  <a :href="link.href" class="footer-link">{{ link.text }}</a>
                </li>
              </ul>
            </div>
  
            <div class="divider"></div>
  
            <div class="quicklink-wrapper">
              <ul class="quicklink-list">
                <li v-for="(link, index) in supportLinks" :key="index">
                  <a :href="link.href" class="quicklink-link">{{ link.text }}</a>
                </li>
              </ul>
  
              <ul class="social-list">
                <li v-for="(social, index) in socialLinks" :key="index">
                  <a :href="social.href" class="social-link">
                    <ion-icon :name="social.icon"></ion-icon>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
  
        <div class="footer-bottom">
          <div class="container">
            <p class="copyright">
              &copy; {{ currentYear }} <a href="#">Filmlane</a>. All Rights Reserved
            </p>
  
            <img src="./assets/images/footer-bottom-img.png" alt="Online banking companies logo" class="footer-bottom-img">
          </div>
        </div>
      </footer>
    `,
    data() {
      return {
        currentYear: new Date().getFullYear(),
        quickLinks: [
          { text: 'Faq', href: '#' },
          { text: 'Help center', href: '#' },
          { text: 'Terms of use', href: '#' },
          { text: 'Privacy', href: '#' }
        ],
        supportLinks: [
          { text: 'Live', href: '#' },
          { text: 'Faq', href: '#' },
          { text: 'Privacy policy', href: '#' },
          { text: 'Watch list', href: '#' }
        ],
        socialLinks: [
          { icon: 'logo-facebook', href: '#' },
          { icon: 'logo-twitter', href: '#' },
          { icon: 'logo-pinterest', href: '#' },
          { icon: 'logo-linkedin', href: '#' }
        ]
      }
    }
  };
  
  // Go To Top Button Component
  const GoToTop = {
    template: `
      <a href="#top" class="go-top" :class="{ active: isActive }" @click.prevent="scrollToTop">
        <ion-icon name="chevron-up"></ion-icon>
      </a>
    `,
    data() {
      return {
        isActive: false
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      handleScroll() {
        this.isActive = window.scrollY > 500;
      },
      scrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };
  
  // Register components
  const app = createApp(App);
  
  // Register global components
  app.component('Header', Header);
  app.component('HeroSection', HeroSection);
  app.component('TopTenAllTimes', TopTenAllTimes);
  app.component('CelebritiesSection', CelebritiesSection);
  app.component('ServiceSection', ServiceSection);
  app.component('TopRatedMovies', TopRatedMovies);
  app.component('TvSeries', TvSeries);
  app.component('TopTenUS', TopTenUS);
  app.component('TopTenChinese', TopTenChinese);
  app.component('TopTenKorean', TopTenKorean);
  app.component('TopTenAnime', TopTenAnime);
  app.component('CtaSection', CtaSection);
  app.component('Footer', Footer);
  app.component('GoToTop', GoToTop);
  app.component('MovieCard', MovieCard);
  app.component('SectionTitle', SectionTitle);
  
  // Mount the app
  app.component('SignInForm', SignInForm);
  app.component('SignUpForm', SignUpForm);
  app.component('UserProfile', UserProfile);
  


  app.mount('#app');