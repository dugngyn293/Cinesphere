export default {
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>Sign in to continue</h2>

        <div class="captcha-box">
          <div class="captcha-code">{{ generatedCaptcha }}</div>
          <input v-model="userCaptchaInput" placeholder="Enter CAPTCHA" />
          <div v-if="captchaError" class="error">Incorrect CAPTCHA. Try again.</div>
        </div>

        <button @click="validateCaptcha">Sign in with Google</button>
      </div>
    </div>
  `,
  data() {
    return {
      generatedCaptcha: '',
      userCaptchaInput: '',
      captchaError: false
    };
  },
  methods: {
    generateCaptcha() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      this.generatedCaptcha = '';
      for (let i = 0; i < 5; i++) {
        this.generatedCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    },
    validateCaptcha() {
      if (this.userCaptchaInput.trim().toUpperCase() === this.generatedCaptcha) {
        this.$emit('authenticated'); 
        window.location.href = '/auth/google'; 
      } else {
        this.captchaError = true;
        this.generateCaptcha(); 
      }
    }
  },
  mounted() {
    this.generateCaptcha();
  }
};
