
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
import { SearchResult } from './SearchResult.js';

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
    SearchResult
  },
  data() {
    return {
      query: '',
      showProfileForm: false,
      isDarkMode: false,
      userAvatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
      userName: ''
    };
  },
  computed: {
    searchQueryFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get('query');
    }
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


    const currentQuery = this.searchQueryFromURL;
    if (currentQuery) {
      this.query = currentQuery;
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
    handleSearch() {
      const encoded = encodeURIComponent(this.query);
      window.history.pushState({}, '', `?query=${encoded}`);

      window.dispatchEvent(new Event('popstate'));
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

          <SearchResult v-if="searchQueryFromURL" :query="searchQueryFromURL" />

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

            <select name="language" id="language" v-model="selectedLanguage">
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
            </select>
          </div>

          <!-- Only show profile icon -->
          <!-- Profile avatar and username -->
          <div class="settings-button" @click="$emit('open-profile')">
            <img :src="avatarUrl" class="user-avatar" />
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
      searchQuery: '',
      showSearchInput: false,
      languages: [
        { code: 'en', name: 'English' },
        { code: 'vi', name: 'Vietnamese' }
      ],
      navItems: [
        { text: 'Home', link: '/' },
        { text: 'Movies', link: '/movies' },
        { text: 'TV Series', link: '/tv' }
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
        const query = encodeURIComponent(this.searchQuery.trim());
        window.location.href = `/api/search?query=${query}`;
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
app.component('SearchResult', SearchResult);

// Mount the app
app.component('UserProfile', UserProfile);

app.mount('#app');