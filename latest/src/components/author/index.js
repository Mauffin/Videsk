import { renderUI, updateAuthorList } from './render.js';
import { fetchAuthors } from '../../api.js';
import { formatDate } from '../../utils.js';

export class AuthorComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = {
      loading: true,
      authors: [],
      maxAuthors: 6,
      filteredAuthors: []
    };
  }

  static get observedAttributes() {
    return ["loading"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "loading") {
      this.state.loading = newValue !== null;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.fetchData();
  }

  setupEventListeners() {
    const searchInput = document.querySelector("#search-input");
    searchInput.addEventListener('input', (event) => this.filterAuthors(event.target.value));

    const homeButton = document.querySelector(".home-button");
    homeButton.addEventListener("click", () => this.showAllAuthors());

    const loadMoreButton = document.querySelector(".load-more");
    loadMoreButton.addEventListener("click", () => this.loadMoreAuthors());
  }

  render() {
    this.shadowRoot.innerHTML = renderUI(this.state, formatDate);
    this.setupAuthorClickListeners();
    this.updateLoadMoreButtonVisibility();
  }

  setupAuthorClickListeners() {
    this.shadowRoot
      .querySelectorAll(".author-name, .author-avatar")
      .forEach((element) => {
        element.addEventListener("click", (event) => {
          const authorId = event.target.dataset.authorId;
          const authorName = event.target.textContent;
          const articlesListComponent = document.querySelector("articles-list");
          articlesListComponent.setAttribute("author-id", authorId);
          articlesListComponent.setAttribute("author-name", authorName);
          this.hideOtherAuthors(authorId);
        });
      });
  }

  updateLoadMoreButtonVisibility() {
    const loadMoreButton = document.querySelector(".load-more");
    const authorsToDisplay = this.state.filteredAuthors.length > 0 ? this.state.filteredAuthors : this.state.authors;
    if (this.state.maxAuthors < authorsToDisplay.length) {
      loadMoreButton.classList.remove("hidden");
    } else {
      loadMoreButton.classList.add("hidden");
    }
  }

  loadMoreAuthors() {
    this.state.maxAuthors += 6;
    this.render();
  }

  hideOtherAuthors(selectedAuthorId) {
    const authorCards = this.shadowRoot.querySelectorAll(".author-card");
    authorCards.forEach((card) => {
      const authorId = card.dataset.authorId;
      card.classList.toggle("hidden", authorId !== selectedAuthorId);
    });
  }

  showAllAuthors() {
    this.state = { ...this.state, maxAuthors: 6, filteredAuthors: [] };
    this.render();
    const articlesListComponent = document.querySelector("articles-list");
    articlesListComponent.clearArticles();
  }

  filterAuthors(searchParam) {
    this.state.filteredAuthors = this.state.authors.filter(author => 
      author.name.toLowerCase().includes(searchParam.toLowerCase())
    );
    this.state.maxAuthors = 6;
    this.updateAuthorList();
  }

  updateAuthorList() {
    updateAuthorList(this.shadowRoot, this.state, formatDate);
    this.setupAuthorClickListeners();
    this.updateLoadMoreButtonVisibility();
  }

  async fetchData() {
    const cacheKey = 'authorData';
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      this.state.authors = JSON.parse(cachedData);
      this.state.loading = false;
      this.render();
      return;
    }

    try {
      const authors = await fetchAuthors();
      this.state.authors = authors;
      localStorage.setItem(cacheKey, JSON.stringify(authors));
      this.state.loading = false;
      this.render();
    } catch (error) {
      console.error("Error fetching data:", error);
      this.state.loading = false;
      this.render();
    }
  }
}

customElements.define("author-component", AuthorComponent);