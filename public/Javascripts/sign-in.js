export const SignInForm = {
  props: ['visible'],
  emits: ['close', 'success'], 
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      error: null
    };
  },
  methods: {
    async handleSignin() {
      this.loading = true;
      this.error = null;

      if (!this.form.email || !this.form.password) {
        this.error = 'Email and password are required.';
        this.loading = false;
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });

        const result = await res.json();

        if (res.ok) {
          alert('✅ Login successful!');
          this.resetForm();
          this.$emit('success');
        } else {
          this.error = result.message || '❌ Login failed.';
        }
      } catch (err) {
        console.error('Login failed:', err);
        this.error = '❌ Could not connect to the server.';
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.form.email = '';
      this.form.password = '';
    }
  },
  template: `
    <div v-if="visible" class="signin-form-wrapper">
      <div class="signin-overlay" @click="$emit('close')"></div>
      <div class="signin-form">
        <h3>Sign In</h3>

        <form @submit.prevent="handleSignin">
          <input v-model="form.email" type="email" placeholder="Email" required />
          <input v-model="form.password" type="password" placeholder="Password" required />
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <p v-if="error" class="error-message" style="color: red; text-align:center; margin-top: 10px;">
          {{ error }}
        </p>

        <p style="text-align:center; margin: 1rem 0;">Or</p>

        <!-- Redirect-based Google Sign-In -->
        <a href="/auth/google" class="google-signin-button" style="display: block; text-align: center;">
          Sign in with Google
        </a>

        <button class="btn-close" @click="$emit('close')">X</button>
      </div>
    </div>
  `
};
