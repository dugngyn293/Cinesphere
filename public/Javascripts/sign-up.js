export const SignUpForm = {
  props: ['visible'],
  emits: ['close'],
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: ''
      },
      loading: false,
      error: null
    };
  },
  methods: {
    async handleSignup() {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });

        const result = await res.json();

        if (res.ok) {
          alert('✅ Registration successful!');
          this.resetForm();
          this.$emit('close');
        } else {
          this.error = result.message || 'Something went wrong.';
        }
      } catch (err) {
        console.error('Signup failed:', err);
        this.error = '❌ Failed to connect to the server.';
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form.username = '';
      this.form.email = '';
      this.form.password = '';
    }
  },
  template: `
    <div v-if="visible" class="signup-form-wrapper">
      <div class="signup-overlay" @click="$emit('close')"></div>
      <div class="signup-form">
        <h3>Sign Up</h3>
        <form @submit.prevent="handleSignup">
          <input v-model="form.username" type="text" placeholder="Username" required />
          <input v-model="form.email" type="email" placeholder="Email" required />
          <input v-model="form.password" type="password" placeholder="Password" required />
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>

        <p v-if="error" class="error-message" style="color: red; text-align:center; margin-top: 10px;">{{ error }}</p>

        <p style="text-align:center; margin: 1rem 0;">Or</p>

        <!-- Redirect-based Google Sign-Up -->
        <a href="/auth/google" class="google-signin-button">Sign up with Google</a>

        <button class="btn-close" @click="$emit('close')">X</button>
      </div>
    </div>
  `
};
