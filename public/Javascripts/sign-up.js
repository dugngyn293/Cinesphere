export const SignUpForm = {
  props: ['visible'],
  emits: ['close'],
  template: `
    <div v-if="visible" class="signup-form-wrapper">
      <div class="signup-overlay" @click="$emit('close')"></div>
      <div class="signup-form">
        <h3>Sign Up</h3>
        <form @submit.prevent="handleSignup">
          <input v-model="form.username" type="text" placeholder="Username" required />
          <input v-model="form.email" type="email" placeholder="Email" required />
          <input v-model="form.password" type="password" placeholder="Password" required />
          <button type="submit" class="btn btn-primary">Register</button>
        </form>

        <p style="text-align:center; margin: 1rem 0;">Or</p>
        <div id="google-btn" class="google-signin-button"></div>

        <button class="btn-close" @click="$emit('close')">X</button>
      </div>
    </div>
  `,
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: ''
      }
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.renderGoogleButton();
      }
    }
  },
  methods: {
    async handleSignup() {
      try {
        const res = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });

        const result = await res.json();

        if (res.ok) {
          alert('Registration successful!');
          this.$emit('close');
          this.form.username = '';
          this.form.email = '';
          this.form.password = '';
        } else {
          alert('Error: ' + result.message);
        }
      } catch (err) {
        alert('Failed to connect to server.');
        console.error(err);
      }
    },
    renderGoogleButton() {
      if (window.google && window.google.accounts) {
        google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // need to replace with your actual client ID
          callback: this.handleGoogleResponse
        });

        google.accounts.id.renderButton(
          document.getElementById('google-btn'),
          { theme: 'outline', size: 'large' }
        );
      }
    },
    async handleGoogleResponse(response) {
      try {
        const res = await fetch('http://localhost:3000/api/google-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential })
        });

        const result = await res.json();

        if (res.ok) {
          alert('Google sign-up successful!');
          this.$emit('close');
        } else {
          alert('Error: ' + result.message);
        }
      } catch (err) {
        alert('Google sign-up failed.');
        console.error(err);
      }
    }
  }
};
