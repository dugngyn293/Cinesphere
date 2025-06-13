export const UserProfile = {
  props: ['visible'],
  emits: ['close', 'profile-updated'],
  template: `
    <div v-if="visible" class="profile-wrapper">
      <div class="overlay" @click="$emit('close')"></div>

      <div class="profile-box" v-if="activeView === 'settings'">
        <img :src="avatarPreviewUrl || currentAvatarUrl" class="avatar-preview" />
        <h2>Settings</h2>
        <ul class="profile-menu">
          <li @click="goToProfileView">👤 Profile</li>
          <li @click="goToPlaylist">🎵 Your Playlist</li>
          <li @click="goToBadge">🏆 Badge</li>
          <li @click="goToRating">⭐ Your Star Rating</li>
        </ul>
        <button class="logout-button" @click="logout">🚪 Log out</button>
        <button class="btn-close" @click="$emit('close')">X</button>
      </div>

      <div class="profile-box" v-else-if="activeView === 'profile-view'">
        <div class="profile-info">
          <div class="info-left">
            <button class="profile-btn" @click="goToUpdateProfile">Update profile</button>
            <button class="profile-btn" @click="activeView = 'settings'">Back to settings</button>
          </div>
          <div class="info-right">
            <img :src="avatarPreviewUrl || currentAvatarUrl" class="avatar-large avatar-preview" />
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      activeView: 'settings',
      form: {
        name: '',
        password: '',
        avatar: null,
        id: null
      },
      currentAvatarUrl: 'https://www.w3schools.com/howto/img_avatar.png',
      avatarPreviewUrl: null,
      playlist: []
    };
  },
  mounted() {
    this.loadUserProfile();
    window.addEventListener('storage', this.syncPlaylist);
    this.syncPlaylist();

    // 🔁 Nếu quay lại từ updateprofile.html
    if (sessionStorage.getItem('goBackToProfileView')) {
      this.activeView = 'profile-view';
      sessionStorage.removeItem('goBackToProfileView');
    }
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncPlaylist);
  },
  methods: {
    loadUserProfile() {
      const stored = localStorage.getItem('userProfile');
      if (stored) {
        const data = JSON.parse(stored);
        this.form.name = data.name || '';
        this.form.id = data.id || null;
        this.currentAvatarUrl = data.avatarUrl || this.currentAvatarUrl;
      }
    },
    handleAvatarChange(e) {
      const [file] = e.target.files;
      if (file) {
        this.form.avatar = file;
        this.avatarPreviewUrl = URL.createObjectURL(file);
      }
    },
    async updateProfile() {
      try {
        const formData = new FormData();
        formData.append("name", this.form.name);
        formData.append("password", this.form.password);
        formData.append("id", this.form.id);
        if (this.form.avatar) {
          formData.append("avatar", this.form.avatar);
        }

        const res = await fetch("/api/update-profile", {
          method: "POST",
          body: formData
        });

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          throw new Error("Server did not return valid JSON: " + text);
        }

        if (res.ok) {
          const updatedProfile = {
            name: this.form.name,
            avatarUrl: data.avatarUrl || this.currentAvatarUrl,
            id: this.form.id
          };

          this.currentAvatarUrl = updatedProfile.avatarUrl;
          localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

          Swal.fire({
            icon: "success",
            title: "Profile Updated!",
            timer: 1500,
            toast: true,
            position: "top-end",
            showConfirmButton: false
          });

          this.activeView = "profile-view";
          this.$emit("profile-updated", updatedProfile);
        } else {
          Swal.fire({
            icon: "error",
            title: "Update failed",
            text: data.message || "Unknown error"
          });
        }
      } catch (err) {
        console.error("Error updating profile:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Something went wrong"
        });
      }
    },
    goToUpdateProfile() {
      sessionStorage.setItem('goBackToProfileView', 'true');
      window.location.href = '/updateprofile.html';
    },
    goToProfileView() {
      this.activeView = 'profile-view';
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
      localStorage.removeItem('userProfile');
      window.location.href = '/auth.html';
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