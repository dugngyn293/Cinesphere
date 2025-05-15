import { createApp } from 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js';

import { SignUpForm } from './sign-up.js';
import { SignInForm } from './sign-in.js';
import { UserProfile } from './user-profile.js';
import { MovieCard } from './MovieCard.js';
import { SectionTitle } from './SectionTitle.js';
import { TopTenAllTimes } from './top-10-all.js';
import { CelebritiesSection } from './CelebritiesSection.js';
import { TopRatedMovies } from './TopRatedMovies.js';
import { TvSeries } from './TvSeries.js';
import { TopTenUS } from './TopTenUS.js';
import { TopTenChinese } from './TopTenChinese.js';
import { TopTenKorean } from './TopTenKorean.js';
import { TopTenAnime } from './TopTenAnime.js';

const App = {
  components: {
    SignUpForm,
    SignInForm,
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
    TopTenAnime
  },
  data() {
    return {
      showSignupForm: false,
      showSigninForm: false,
      showProfileForm: false,
      isDarkMode: false
    };
  },
  mounted() {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  },
  methods: {
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
    }
  },
  template: `
    <div>
      <Header 
        @open-signup="showSignupForm = true"
        @open-signin="showSigninForm = true"
        @open-profile="showProfileForm = true" />

      <SignUpForm :visible="showSignupForm" @close="showSignupForm = false" />
      <SignInForm :visible="showSigninForm" @close="showSigninForm = false" />
      <UserProfile :visible="showProfileForm" @close="showProfileForm = false" />

      <!-- 🌗 Dark Mode Toggle Button -->
      <button @click="toggleDarkMode" class="toggle-btn">
        {{ isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode' }}
      </button>

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
    </div>
  `
};



// Header Component
const Header = {
  template: `
    <header class="header" :class="{ active: isMenuActive }">
      <div class="container">
        <div class="overlay" :class="{ active: isMenuActive }" @click="closeMenu"></div>

        <a href="./index.html" class="logo">
          <img src="../images/logo.jpeg" alt="Filmlane logo" class="logo-img">
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
              <img src="../images/logo.jpeg" alt="Filmlane logo" class="logo-img">

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