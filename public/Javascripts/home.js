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
    TopTenJapanese
  },
  data() {
    return {
      showProfileForm: false,
      isDarkMode: false,
      userAvatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png', // 👈 default avatar
      userName: '',
      searchResults: [], // New: For storing search results
      isShowingSearchResults: false, // New: Flag to control display of search results
      searchError: null, // New: To store any search error messages
      isLoadingSearch: false // New: For loading state during search
    };
  },

  mounted() {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    if (profile) {
      this.userAvatarUrl = profile.avatarUrl || this.userAvatarUrl;
      this.userName = profile.name || '';
    }
    if (window.location.hash === '#openProfile') {
      this.showProfileForm = true;
    }

  },
  methods: {
    handleProfileUpdate(profile) {
      this.userAvatarUrl = profile.avatarUrl || this.userAvatarUrl;
      this.userName = profile.name || '';
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
    async executeSearch(query) { // New: Handles the actual search fetch and state updates
      if (!query || !query.trim()) {
        this.resetSearchState();
        return;
      }
      this.isShowingSearchResults = true;
      this.isLoadingSearch = true;
      this.searchResults = [];
      this.searchError = null;

      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Search failed: ${response.status} - ${errorText || 'Server error'}`);
        }
        const data = await response.json();
        this.searchResults = data.results || [];
      } catch (err) {
        console.error("Execute Search Error:", err);
        this.searchError = err.message || "Failed to fetch search results.";
        this.searchResults = [];
      } finally {
        this.isLoadingSearch = false;
      }
    },
    resetSearchState() { // Renamed and used to clear search and return to home view
        this.isShowingSearchResults = false;
        this.searchResults = [];
        this.searchError = null;
        this.isLoadingSearch = false;
    }
  },
  template: `
    <div>
      <Header
        :avatar-url="userAvatarUrl"
        :user-name="userName"
        @open-profile="showProfileForm = true"
        @search-requested="executeSearch" 
        @navigate-home="resetSearchState"
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
        <div v-if="isShowingSearchResults" class="search-results-section container">
          <div class="search-results-header">
            <h2>Search Results</h2>
            <button @click="resetSearchState" class="btn btn-secondary" style="margin-bottom: 20px;">Close Search</button>
          </div>
          <div v-if="isLoadingSearch" class="loading-message">
            <p>Loading results...</p>
          </div>
          <div v-else-if="searchError" class="error-message">
            <p>Sorry, there was an error: {{ searchError }}</p>
          </div>
          <div v-else-if="searchResults.length > 0" class="movies-grid">
            <MovieCard v-for="movie in searchResults" :key="movie.id" :movie="movie" />
          </div>
          <div v-else>
            <p>No results found for your query.</p>
          </div>
        </div>
        <article v-else>
          <HeroSection />
          <TopTenAllTimes />
          <CelebritiesSection />
          <TopRatedMovies />
          <TvSeries />
          <TopTenUS />
          <TopTenChinese />
          <TopTenKorean />
          <TopTenJapanese />
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
  emits: ['open-profile', 'search-requested', 'navigate-home'], // Updated emits
  template: `
    <header class="header" :class="{ active: isMenuActive }">
      <div class="container">
        <div class="overlay" :class="{ active: isMenuActive }" @click="closeMenu"></div>

        <a href="./index.html" @click.prevent="goHome" class="logo">
          <img src="../images/logo.jpeg" alt="Cinesphere logo" class="logo-img">
        </a>

        <div class="header-actions">
          <button class="search-btn" @click="toggleSearch" :aria-expanded="isSearchActive.toString()" aria-label="Toggle search">
            <ion-icon :name="isSearchActive ? 'close-outline' : 'search-outline'"></ion-icon>
          </button>

          <div v-if="isSearchActive" class="search-input-area">
            <input type="search" v-model="searchQuery" @keyup.enter="handleSearchSubmit" placeholder="Search for movies..." ref="searchInput" aria-label="Search movies">
            <button @click="handleSearchSubmit" class="search-submit-btn" aria-label="Submit search">
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </button>
          </div>

          <div class="lang-wrapper" v-show="!isSearchActive">
            <label for="language">
              <ion-icon name="globe-outline"></ion-icon>
            </label>
            <select name="language" id="language" v-model="selectedLanguage">
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
            </select>
          </div>

          <div class="settings-button" @click="$emit('open-profile')" v-show="!isSearchActive">
            <img :src="avatarUrl" class="user-avatar" />
            <span v-if="userName" class="welcome-msg">Hi, {{ userName }}</span>
          </div>
        </div>

        <button class="menu-open-btn" @click="openMenu" v-show="!isSearchActive">
          <ion-icon name="reorder-two"></ion-icon>
        </button>

        <nav class="navbar" :class="{ active: isMenuActive }">
          <div class="navbar-top">
            <a href="./index.html" @click.prevent="goHomeAndCloseMenu" class="logo">
              <img src="../images/logo.jpeg" alt="Cinesphere logo" class="logo-img">
            </a>
            <button class="menu-close-btn" @click="closeMenu">
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          <ul class="navbar-list">
            <li v-for="item in navItems" :key="item.text">
              <a :href="item.link" @click.prevent="navItemClicked(item.link)" class="navbar-link">{{ item.text }}</a>
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
        { code: 'en', name: 'English' },
        { code: 'vi', name: 'Vietnamese' }
      ],
      navItems: [
        { text: 'Home', link: './index.html' }, // Assuming relative links for now
        { text: 'Movies', link: '#movies' }, // Placeholder links
        { text: 'TV Series', link: '#tv' }  // Placeholder links
      ],
      socialMedia: [
        { icon: 'logo-facebook', link: '#' },
        { icon: 'logo-twitter', link: '#' },
        { icon: 'logo-instagram', link: '#' }
      ],
      isSearchActive: false, 
      searchQuery: ''     
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
      this.isSearchActive = !this.isSearchActive;
      if (this.isSearchActive) {
        this.$nextTick(() => {
          if (this.$refs.searchInput) { // Check if ref exists
             this.$refs.searchInput.focus();
          }
        });
      } else {
        // If search is closed without submitting, we might want to clear query
        // or let App decide if results should be cleared via navigate-home logic
        // For now, just hiding it. If user reopens, query is still there.
      }
    },
    handleSearchSubmit() { // Renamed from submitSearch for clarity
      if (!this.searchQuery.trim()) return;
      this.$emit('search-requested', this.searchQuery);
      // Keep search active or close it? For now, keep active to see query.
      // To close after search: this.isSearchActive = false;
    },
    goHome() { 
      this.$emit('navigate-home'); 
      // If not using a SPA router, simple navigation might be enough,
      // but emitting allows parent to clear state.
      // window.location.href = './index.html'; // This would cause a full page reload
    },
    goHomeAndCloseMenu() {
      this.goHome();
      this.closeMenu();
    },
    navItemClicked(link) {
      // For now, simple navigation. If using Vue Router, this would be different.
      if (link === './index.html') {
        this.goHome();
      }
      // Potentially close menu, or let default link behavior handle it
      this.closeMenu();
      // window.location.href = link; // Uncomment if these are actual pages for now
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
              &copy; {{ currentYear }} <a href="#">Cinesphere</a>. All Rights Reserved
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

// Mount the app
app.component('UserProfile', UserProfile);



app.mount('#app');