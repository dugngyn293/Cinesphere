export const SearchResultItem = {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['open-detail'],
  computed: {
    displayTitle() {
      return this.item.title || 'Title Not Available';
    },
    posterAltText() {
      const titlePart = this.item.title ? this.item.title : 'Movie';
      return `${titlePart} poster`;
    },
    // The item.poster is already a full URL from App.js transformation
    // item.year is already formatted
    overviewSnippet() {
      if (!this.item.overview) return 'No overview available.';
      const maxLength = 150; // Adjust as needed
      if (this.item.overview.length <= maxLength) {
        return this.item.overview;
      }
      return this.item.overview.substring(0, maxLength) + '...';
    }
  },
  template: `
    <div class="search-result-item" @click="$emit('open-detail', item.id)">
      <img :src="item.poster" :alt="posterAltText" class="search-result-poster" />
      <div class="search-result-details">
        <h3 class="search-result-title">{{ displayTitle }}</h3>
        <p class="search-result-year">{{ item.year }}</p>
        <!-- Displaying a snippet of the overview -->
        <p class="search-result-overview">{{ overviewSnippet }}</p>
      </div>
    </div>
  `
};