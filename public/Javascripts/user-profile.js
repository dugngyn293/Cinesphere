export const UserProfile = {
  props: ['visible'],
  emits: ['close'],
  template: `
    <div v-if="visible" class="profile-wrapper">
      <div class="overlay" @click="$emit('close')"></div>
      <div class="profile-box">
        <h2>Update Profile</h2>
        <form @submit.prevent="updateProfile">
          <label>Avatar:</label>
          <input type="file" @change="handleAvatarChange" />
          <img :src="avatarPreviewUrl || currentAvatarUrl" class="avatar-preview" />

          <label>Name:</label>
          <input v-model="form.name" type="text" />

          <label>Email:</label>
          <input v-model="form.email" type="email" />

          <button type="submit">Save</button>
        </form>
        <button class="btn-close" @click="$emit('close')">X</button>
      </div>
    </div>
  `,
  data() {
    return {
      form: {
        name: '',
        email: '',
        avatar: null
      },
      currentAvatarUrl: '/images/avatar-default.png',
      avatarPreviewUrl: null
    };
  },
  methods: {
    handleAvatarChange(e) {
      this.form.avatar = e.target.files[0];
      this.avatarPreviewUrl = URL.createObjectURL(this.form.avatar);
    },
    async updateProfile() {
      // Simulate an API call
      console.log('Updated data:', this.form);

      alert('Thông tin đã được cập nhật (giả lập)');
    }
  },
  mounted() {
    
    this.form.name = '';
    this.form.email = '';
    this.currentAvatarUrl = '/images/avatar-default.png';
  }
};
