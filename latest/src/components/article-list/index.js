import { renderUI } from './render.js';
import { fetchArticles, fetchInitialArticles, fetchMoreArticles } from '../../api.js';

export class ArticlesListComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = {
      articles: [],
      filteredArticles: [],
      authorName: "",
      currentPage: 1,
      articlesPerPage: 3,
      isLoading: false,
      selectedAuthorId: null
    };
  }

  static get observedAttributes() {
    return ["author-id", "author-name"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "author-id") {
      this.state.selectedAuthorId = newValue;
      this.fetchArticles(newValue);
    }
    if (name === "author-name") {
      this.state.authorName = newValue;
      this.render();
    }
  }

  connectedCallback() {
    this.fetchInitialArticles();
    this.setupInfiniteScroll();
  }

  async fetchInitialArticles() {
    if (!this.state.selectedAuthorId) {
      try {
        this.state.articles = await fetchInitialArticles(this.state.currentPage, this.state.articlesPerPage);
        this.render();
      } catch (error) {
        console.error("Error fetching initial articles:", error);
      }
    }
  }

  async fetchMoreArticles() {
    if (this.state.isLoading || this.state.selectedAuthorId) return;

    this.state.isLoading = true;
    try {
      const newArticles = await fetchMoreArticles(this.state.currentPage + 1, this.state.articlesPerPage);
      this.state.articles = [...this.state.articles, ...newArticles];
      this.state.currentPage++;
      this.render();
    } catch (error) {
      console.error("Error fetching more articles:", error);
    } finally {
      this.state.isLoading = false;
    }
  }

  async fetchArticles(authorId) {
    try {
      this.state.articles = await fetchArticles(authorId);
      this.render();
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }

  setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        this.fetchMoreArticles();
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = renderUI(this.state.articles);
  }

  clearArticles() {
    this.state = {
      ...this.state,
      authorName: "",
      articles: [],
      selectedAuthorId: null,
      currentPage: 1
    };
    this.fetchInitialArticles();
  }

  showSelectedArticle(selectedArticleId) {
    const articleComponents = this.shadowRoot.querySelectorAll('article-component');
    articleComponents.forEach((articleComponent) => {
      const article = JSON.parse(articleComponent.getAttribute('article'));
      articleComponent.style.display = article.id === selectedArticleId ? 'block' : 'none';
    });
  }
}

customElements.define("articles-list", ArticlesListComponent);
