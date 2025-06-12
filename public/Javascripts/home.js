
import { createApp } from 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js';

//import { SignUpForm } from './sign-up.js';
//import { SignInForm } from './sign-in.js';
import { UserProfile } from './user-profile.js';
import { MovieCard } from './MovieCard.js';
import { SectionTitle } from './SectionTitle.js';
import { TopTenAllTimes } from './top-10-all.js';
import { CelebritiesSection } from './CelebritiesSection.js';
import { TopRatedMovies } from './TopRatedMovies.js';
import { TvSeries } from './TvSeries.js';
import { TopTenUS } from './TopTenUs.js';
import { TopTenChinese } from './TopTenChinese.js';
import { TopTenKorean } from './TopTenKorean.js';
import { TopTenJapanese } from './TopTenJapanese.js';
import { SearchResultItem } from './SearchResultItem.js';
import { Movies } from './Movies.js';
import { TvShows } from './TvShows.js';

const App = {
  components: {
    UserProfile,
    MovieCard,
    SectionTitle,
    TopTenAllTimes,
    CelebritiesSection,
    TopRatedMovies,
    TvSeries,
    TopTenUS,
    TopTenChinese,
    TopTenKorean,
    TopTenJapanese,
    SearchResultItem,
    Movies,
    TvShows
  },
  data() {
    return {
      currentSection: 'home',
      query: '',
      results: [],
      showProfileForm: false,
      isDarkMode: false,
      userAvatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
      userName: '',
      currentPage: window.location.hash.replace('#', '') || 'home'
    };
  },
  computed: {
    searchQueryFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get('query');
    }
  },
  mounted() {
    const hash = window.location.hash;
    this.updateSectionFromHash(hash);

    window.addEventListener('hashchange', () => {
      this.updateSectionFromHash(window.location.hash);
    });
    if (hash === '#movies') {
      this.currentSection = 'movies';
    } else if (hash === '#tv') {
      this.currentSection = 'tv';
    } else {
      this.currentSection = 'home';
    }

    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();

    const params = new URLSearchParams(window.location.search);
    const usernameFromURL = params.get("username");
    const avatarFromURL = params.get("avatar");

    if (usernameFromURL) {
      localStorage.setItem("username", usernameFromURL);
      this.userName = usernameFromURL;
    } else {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) this.userName = storedUsername;
    }

    if (avatarFromURL) {
      localStorage.setItem("avatar", avatarFromURL);
      this.userAvatarUrl = avatarFromURL;
    } else {
      const storedAvatar = localStorage.getItem("avatar");
      if (storedAvatar) this.userAvatarUrl = storedAvatar;
    }

    const profile = JSON.parse(localStorage.getItem('userProfile'));
    if (profile) {
      this.userAvatarUrl = profile.avatarUrl || this.userAvatarUrl;
      this.userName = profile.name || this.userName;
    }

    if (window.location.hash === '#openProfile') {
      this.showProfileForm = true;
    }

    const currentQuery = this.searchQueryFromURL;
    if (currentQuery) {
      this.query = currentQuery;

      fetch(`/api/search?query=${encodeURIComponent(currentQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          this.results = data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/images/default.jpg',
            year: (movie.release_date && movie.release_date.split('-')[0]) || 'N/A',
            overview: movie.overview || '',
          }));
        })
        .catch((err) => console.error('Search failed:', err));
    }
    window.addEventListener('hashchange', () => {
      this.currentPage = window.location.hash.replace('#', '') || 'home';
    });
  },


  methods: {
    updateSectionFromHash(hash) {
      if (hash === '#movies') {
        this.currentSection = 'movies';
      } else if (hash === '#tv') {
        this.currentSection = 'tv';
      } else {
        this.currentSection = 'home';
      }
    },
    handleProfileUpdate(profile) {
      if (profile.avatarUrl) {
        this.userAvatarUrl = profile.avatarUrl;
        localStorage.setItem("avatar", profile.avatarUrl);
      }
      if (profile.name) {
        this.userName = profile.name;
        localStorage.setItem("username", profile.name);
      }
    },

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
      this.applyTheme();
    },
    applyTheme() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    handleSearch() {
      const encoded = encodeURIComponent(this.query);
      window.location.href = `search.html?query=${encoded}`;
    },


    handleOpenDetail(id) {
      window.location.href = `/MovieDetail.html?id=${id}`;
    }
  },
  template: `
    <div>
      <Header
        :avatar-url="userAvatarUrl"
        :user-name="userName"
        @open-profile="showProfileForm = true"
      />

      <UserProfile
        :visible="showProfileForm"
        @close="showProfileForm = false"
        @profile-updated="handleProfileUpdate"
      />

      <!-- 🌗 Dark Mode Toggle Button -->
      <button @click="toggleDarkMode" class="toggle-btn">
        {{ isDarkMode ? '🌙' : '☀️' }}
      </button>

      <main>
        <article>
          <input
            v-model="query"
            placeholder="Enter movie name..."
            @keyup.enter="handleSearch"
          />

          <div v-if="searchQueryFromURL">
            <h2>Search Results for "{{ query }}"</h2>
            <div class="search-results">
              <SearchResultItem
                v-for="item in results"
                :key="item.id"
                :item="item"
                @open-detail="handleOpenDetail"
              />
            </div>
          </div>
          <div v-else-if="currentPage === 'movies'">
            <Movies />
          </div>
          <div v-else-if="currentPage === 'tv'">
            <TvShows />
          </div>
          <template v-else>
            <HeroSection />
            <TopTenAllTimes />
            <CelebritiesSection />
            <TopRatedMovies />
            <TvSeries />
            <TopTenUS />
            <TopTenChinese />
            <TopTenKorean />
            <TopTenJapanese />
          </template>
        </article>
      </main>

      <Footer />
      <GoToTop />
    </div>
  `
};




// Header Component
const Header = {
  props: ['avatarUrl', 'userName'],

  template: `
    <header class="header" :class="{ active: isMenuActive }">
      <div class="container">
        <div class="overlay" :class="{ active: isMenuActive }" @click="closeMenu"></div>

        <a href="./index.html" class="logo">
          <img src="../images/logo.jpeg" alt="Filmlane logo" class="logo-img">
        </a>

        <div class="header-actions">
          <div class="search-wrapper">
            <button class="search-btn" @click="toggleSearch">
              <ion-icon name="search-outline"></ion-icon>
            </button>
            <input
              v-show="showSearchInput"
              v-model="searchQuery"
              @keydown.enter="handleSearch"
              class="search-input"
              type="text"
              placeholder="Search movies..."
            />
          </div>

          <div class="lang-wrapper">
            <label for="language">
              <ion-icon name="globe-outline"></ion-icon>
            </label>
          </div>

          <!-- Profile avatar and username -->
          <div class="settings-button" @click="$emit('open-profile')">
            <img :src="avatarUrl || '/default-avatar.png'" class="user-avatar" alt="User avatar" />
            <span v-if="userName" class="welcome-msg">Hi, {{ userName }}</span>
          </div>

        </div>

        <button class="menu-open-btn" @click="openMenu">
          <ion-icon name="reorder-two"></ion-icon>
        </button>

        <nav class="navbar" :class="{ active: isMenuActive }">
          <div class="navbar-top">
            <a href="./index.html" class="logo">
              <img src="../images/logo.jpeg" alt="Cinesphere logo" class="logo-img">
            </a>

            <button class="menu-close-btn" @click="closeMenu">
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>

          <ul class="navbar-list">
            <li v-for="item in navItems" :key="item.text">
              <a :href="'#' + item.page" class="navbar-link">{{ item.text }}</a>
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
      searchQuery: '',
      showSearchInput: false,
      languages: [
        { code: 'en', name: 'English' },
        { code: 'vi', name: 'Vietnamese' }
      ],
      navItems: [
        { text: 'Home', page: 'home' },
        { text: 'Movies', page: 'movies' },
        { text: 'TV Series', page: 'tv' }
      ],
      socialMedia: [
        { icon: 'logo-facebook', link: '#' },
        { icon: 'logo-twitter', link: '#' },
        { icon: 'logo-instagram', link: '#' }
      ]
    };
  },

  methods: {
    openMenu() {
      this.isMenuActive = true;
    },
    closeMenu() {
      this.isMenuActive = false;
    },
    toggleSearch() {
      this.showSearchInput = !this.showSearchInput;
      this.$nextTick(() => {
        const input = this.$el.querySelector('.search-input');
        if (input && this.showSearchInput) input.focus();
      });
    },
    handleSearch() {
      if (this.searchQuery.trim() !== '') {
        const encoded = encodeURIComponent(this.searchQuery.trim());
        window.location.href = `/search.html?query=${encoded}`;
      }
    }

  }
};


// Hero Section Component
const HeroSection = {
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <p class="hero-subtitle">Cinesphere</p>

          <h1 class="h1 hero-title">
            Unlimited <strong>Movie</strong>, TVs Shows, & More.
          </h1>

          <div class="meta-wrapper">
            <div class="badge-wrapper">
              <div class="badge badge-fill">PG 18</div>
              <div class="badge badge-outline">HD</div>
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
    };
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
               <img src="./images/logo.jpeg" alt="Cinesphere" class="footer-logo">
              </a>

              <ul class="footer-list">
                <li v-for="(link, index) in quickLinks" :key="index">
                  <a :href="link.href" class="footer-link">{{ link.text }}</a>
                </li>
              </ul>
            </div>

            <div class="divider"></div>

            <div class="quicklink-wrapper">

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
              &copy; {{ currentYear }} <a href="#">Cinesphere</a>.
            </p>

          </div>
        </div>
      </footer>
    `,
  data() {
    return {
      currentYear: new Date().getFullYear(),
      socialLinks: [
        { icon: 'logo-facebook', href: '#' },
        { icon: 'logo-twitter', href: '#' },
        { icon: 'logo-pinterest', href: '#' },
        { icon: 'logo-linkedin', href: '#' }
      ]
    };
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
    };
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
app.component('TopRatedMovies', TopRatedMovies);
app.component('TvSeries', TvSeries);
app.component('TopTenUS', TopTenUS);
app.component('TopTenChinese', TopTenChinese);
app.component('TopTenKorean', TopTenKorean);
app.component('TopTenJapanese', TopTenJapanese);
app.component('Footer', Footer);
app.component('GoToTop', GoToTop);
app.component('MovieCard', MovieCard);
app.component('SectionTitle', SectionTitle);
app.component('SearchResultItem', SearchResultItem);
app.component('Movies', Movies);
app.component('TvShows', TvShows);

// Mount the app
app.component('UserProfile', UserProfile);

app.mount('#app');