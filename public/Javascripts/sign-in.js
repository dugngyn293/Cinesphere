export const SignInForm = {
  props: ['visible'],
  emits: ['close'],
  template: `
    <div v-if="visible" class="signin-form-wrapper">
      <div class="signin-overlay" @click="$emit('close')"></div>
      <div class="signin-form">
        <h3>Sign In</h3>
        <form @submit.prevent="handleSignin">
          <input v-model="form.email" type="email" placeholder="Email" required />
          <input v-model="form.password" type="password" placeholder="Password" required />
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <button class="btn-close" @click="$emit('close')">X</button>
      </div>
    </div>
  `,
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async handleSignin() {
      try {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });

        const result = await res.json();

        if (res.ok) {
          alert('Login successful!');
          this.$emit('close');
          // Reset form
          this.form.email = '';
          this.form.password = '';
        } else {
          alert('Login failed: ' + result.message);
        }
      } catch (err) {
        alert('Failed to connect to server.');
        console.error(err);
      }
    }
  }
};
