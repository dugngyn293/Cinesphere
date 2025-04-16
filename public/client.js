const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const user = ref(null);
    const showModal = ref(true);

    onMounted(async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.user) {
          user.value = data.user;
          showModal.value = false;
        }
      } catch {
        showModal.value = true;
      }
    });

    return { user, showModal };
  },
  template: `
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Sign in to continue</h2>
        <a href="/auth/google"><button>Sign in with Google</button></a>
      </div>
    </div>
    <div v-else>
      <h1>Welcome, {{ user.displayName }}!</h1>
      <a href="/logout"><button>Logout</button></a>
    </div>
  `
}).mount("#app");
