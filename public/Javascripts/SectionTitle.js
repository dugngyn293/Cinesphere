export const SectionTitle = {
  props: {
    subtitle: {
      type: String,
      default: 'Online Streaming'
    },
    title: {
      type: String,
      required: true
    },
    showFilters: {
      type: Boolean,
      default: true
    }
  },
  template: `
    <div class="flex-wrapper">
      <div class="title-wrapper">
        <p class="section-subtitle">{{ subtitle }}</p>
        <h2 class="h2 section-title">{{ title }}</h2>
      </div>

      <ul class="filter-list" v-if="showFilters">
        <li v-for="filter in filters" :key="filter">
          <button class="filter-btn" @click="$emit('filter-selected', filter)">
            {{ filter }}
          </button>
        </li>
      </ul>
    </div>
  `,
  data() {
    return {
      filters: ['Movies', 'TV Shows']
    };
  }
};
