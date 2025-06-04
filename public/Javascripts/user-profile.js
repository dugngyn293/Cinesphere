export const UserProfile = {
  props: ['visible'],
  emits: ['close', 'profile-updated'],
  template: `
    <div v-if="visible" class="profile-wrapper">
      <div class="overlay" @click="$emit('close')"></div>

      <!-- 🧭 Settings View -->
      <div class="profile-box" v-if="activeView === 'settings'">
        <img :src="avatarPreviewUrl || currentAvatarUrl" class="avatar-preview" />
        <h2>Settings</h2>

        <ul class="profile-menu">
          <li @click="goToProfile">👤 Profile</li>
          <li @click="goToPlaylist">🎵 Your Playlist</li>
          <li @click="goToBadge">🏆 Badge</li>
          <li @click="goToRating">⭐ Your Star Rating</li>
        </ul>

        <button class="logout-button" @click="logout">🚪 Log out</button>
        <button class="btn-close" @click="$emit('close')">X</button>
      </div>

      <!-- 📝 Edit Profile Form -->
      <div class="profile-box" v-else-if="activeView === 'edit'">
        <h2>Edit Profile</h2>
        <form @submit.prevent="updateProfile">
          <input type="file" @change="handleAvatarChange" />
          <img :src="avatarPreviewUrl || currentAvatarUrl" class="avatar-preview" />
          <input v-model="form.name" type="text" placeholder="Your new username" />
          <input v-model="form.email" type="email" placeholder="Your new password" />
          <button type="submit" class="logout-button">💾 Save</button>
        </form>
        <button class="logout-button" style="margin-top: 1rem;" @click="activeView = 'settings'">← Back to Settings</button>
        <button class="btn-close" @click="closeToHome">X</button>
      </div>
    </div>
  `,
  data() {
    return {
      activeView: 'settings',
      form: {
        name: '',
        email: '',
        avatar: null
      },
      currentAvatarUrl: 'https://www.w3schools.com/howto/img_avatar.png',
      avatarPreviewUrl: null,
      playlist: []
    };
  },
  mounted() {
    window.addEventListener('storage', this.syncPlaylist);
    this.syncPlaylist();
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncPlaylist);
  },
  methods: {
    handleAvatarChange(e) {
      const [file] = e.target.files;
      this.form.avatar = file;
      this.avatarPreviewUrl = URL.createObjectURL(this.form.avatar);
    },
    updateProfile() {
      const profileData = {
        name: this.form.name,
        email: this.form.email,
        avatarUrl: this.avatarPreviewUrl || this.currentAvatarUrl
      };

      localStorage.setItem('userProfile', JSON.stringify(profileData));

      this.currentAvatarUrl = profileData.avatarUrl;

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been saved successfully.',
        timer: 1500,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
        customClass: { container: 'custom-toast-container' }
      });

      this.activeView = 'settings';
      this.$emit('profile-updated', profileData);
    },
    goToProfile() {
      this.activeView = 'edit';
    },
    goToPlaylist() {
      window.location.href = '/playlist.html';
    },
    goToBadge() {
      window.location.href = '/badge.html';
    },
    goToRating() {
      window.location.href = '/star.html';
    },
    logout() {
      window.location.href = '/auth.html';
    },
    async removeFromPlaylist(index) {
      const result = await Swal.fire({
        title: 'Remove Movie?',
        text: 'Do you want to remove this movie from your playlist?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        const updated = [...this.playlist];
        updated.splice(index, 1);
        this.playlist = updated;
        localStorage.setItem('playlist', JSON.stringify(updated));

        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'The movie has been removed from your playlist.',
          timer: 1500,
          showConfirmButton: false,
          position: 'top-end',
          toast: true,
          customClass: { container: 'custom-toast-container' }
        });
      }
    },
    syncPlaylist() {
      const stored = localStorage.getItem('playlist');
      this.playlist = stored ? JSON.parse(stored) : [];
    },
    closeToHome() {
      const isIndex = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/';
      if (isIndex) {
        window.location.href = '/index.html';
      } else {
        this.$emit('close');
      }
    }
  }
};
