const { createApp, ref, onMounted, computed } = Vue;

createApp({
  setup() {
    const user = ref({
      displayName: '',
      email: '',
      photo: '',
      voteScore: 0,
      checkinDays: 0,
    });

    const showModal = ref(true);
    const burgerOpen = ref(false);
    const activeSection = ref("home");

    const showBadgeInfo = ref(false);

    const badgeImage = computed(() => {
      const days = user.value.checkinDays;
      if (days >= 100) return '/images/gold.png';
      if (days >= 50) return '/images/silver.png';
      return '/images/bronze.png';
    });
    const playlists = ref([
      { name: "Favorites" },
      { name: "Watch Later" }
    ]);
    
    const createNewPlaylist = () => {
      const name = prompt("Enter playlist name:", "New Playlist");
      if (name) {
        playlists.value.push({ name });
      }
    };
    const deletePlaylist = (index) => {
      if (confirm(`Delete playlist "${playlists.value[index].name}"?`)) {
        playlists.value.splice(index, 1);
      }
    };
    const selectedPlaylist = ref(null);

    const openPlaylist = (playlist) => {
      selectedPlaylist.value = playlist;
    };

    const closePlaylist = () => {
      selectedPlaylist.value = null;
    };

    
    onMounted(async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.user) {
          user.value = {
            ...user.value,
            ...data.user,
            voteScore: data.user.voteScore ?? 0,
            checkinDays: data.user.checkinDays ?? 0,
          };
          showModal.value = false;
        }
      } catch {
        showModal.value = true;
      }
    });

    const toggleBurger = () => {
      burgerOpen.value = !burgerOpen.value;
    };

    const setSection = (section) => {
      activeSection.value = section;
      burgerOpen.value = false;
    };

    return {
      user,
      showModal,
      burgerOpen,
      toggleBurger,
      activeSection,
      setSection,
      showBadgeInfo,
      badgeImage,
      playlists,           
      createNewPlaylist, 
      deletePlaylist,
      selectedPlaylist,
      openPlaylist,
      closePlaylist,

    };
  },
  template: `
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Sign in to continue</h2>
        <a href="/auth/google"><button>Sign in with Google</button></a>
      </div>
    </div>

    <div v-else>
      <!-- Top Bar -->
      <div class="navbar">
        <div class="left">
          <button @click="toggleBurger">☰</button>
          <h1 style="margin-left: 10px;">Welcome, {{ user.displayName }}!</h1>
        </div>
        <div class="right">
          <img
            v-if="user.photo"
            :src="user.photo"
            alt="Avatar"
            referrerpolicy="no-referrer"
            style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"
          />
        </div>
      </div>

      <!-- Burger Menu -->
      <div v-if="burgerOpen" class="burger-menu">
        <ul>
          <li @click="setSection('home')">Home</li>
          <li @click="setSection('profile')">Your Profile</li>
          <li @click="setSection('playlists')">Playlists</li>
          <li @click="setSection('suggestions')">Film Suggestions</li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <input type="text" placeholder="Search for movies, playlists..." />
        <button>Search</button>
      </div>

      <!-- Active Section -->
      <div class="content">
        <div v-if="activeSection === 'home'">
          <h2>Home</h2>
          <p>Coming soon...</p>
        </div>
        <div v-if="activeSection === 'profile'" class="profile-section">
          <h2>Your Profile</h2>
          <p><strong>Username:</strong> {{ user.displayName }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>

          <!-- Vote Score -->
          <p><strong>Reputation Score:</strong> {{ user.voteScore }} ⭐</p>

          <!-- Check-in Badge -->
          <div class="badge-section">
            <p>
              <strong>Check-in Badge:</strong>
              <img :src="badgeImage" alt="Check-in Badge" style="height: 40px; vertical-align: middle;" />
              <a href="#" @click.prevent="showBadgeInfo = !showBadgeInfo" style="margin-left: 10px; font-size: 18px;">❓</a>
            </p>
            <p v-if="showBadgeInfo" class="badge-info">
              <small>
                Badges are based on your check-in days:<br>
                🟤 Bronze: &lt; 20 days<br>
                ⚪ Silver: &lt; 50 days<br>
                🟡 Gold: ≥ 100 days
              </small>
            </p>
          </div>
        </div>

       <div v-if="activeSection === 'playlists'" class="playlists-section">
          <h2>Your Playlists</h2>

          <ul>
            <li v-for="(playlist, index) in playlists" :key="index" style="margin-bottom: 8px;">
              <a href="#" @click.prevent="openPlaylist(playlist)">
                {{ playlist.name }}
              </a>
              <button @click="deletePlaylist(index)" style="margin-left: 10px; color: red;">
                🗑️ Delete
              </button>
            </li>
          </ul>

          <!-- Create button -->
          <button @click="createNewPlaylist" style="margin-top: 10px;">
            ➕ Create New Playlist
          </button>

          <!-- Playlist popup card -->
          <div v-if="selectedPlaylist" class="playlist-popup">
            <button @click="closePlaylist" class="close-btn">❌</button>
            <h3>{{ selectedPlaylist.name }}</h3>
            <p><a href="#">📽️ View Movies in this Playlist</a></p>
          </div>
        </div>




        <div v-if="activeSection === 'suggestions'">
          <h2>Film Suggestions</h2>
          <p>Coming soon...</p>
        </div>
      </div>
    </div>
  `
}).mount("#app");
