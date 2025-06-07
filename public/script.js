import LoginModal from './login.js';
const { createApp } = Vue;

createApp({
  components: { LoginModal },
  data() {
    return { showModal: true };
  },
  methods: {
    onAuthSuccess() {
      this.showModal = false;
    }
  }
}).mount('#app');
