import { renderUI } from './render.js';

export class ArticleComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.article = null;
    this.isExpanded = false;
    this.isSelected = false;
  }

  static get observedAttributes() {
    return ['article', 'author-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'article') {
      try {
        console.log(newValue);
        this.article = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
        this.render();
      } catch (error) {
        console.error("Error parsing article JSON:", error);
        this.article = null;
      }
    }
    if (name === "author-id") {
      this.fetchAuthorDetails(newValue);
    }
  }

  connectedCallback() {
    this.render();
    document.addEventListener('DOMContentLoaded', this.setupEventListeners.bind(this));
  }

  setupEventListeners() {
    const articlesButton = document.getElementById('articles-button');
    const articlesListComponent = document.querySelector('articles-list');
    // Add any necessary event listeners here
  }

  async fetchAuthorDetails(authorId) {
    try {
      const response = await fetch(`https://5fb46367e473ab0016a1654d.mockapi.io/users/${authorId}`);
      const author = await response.json();
      this.article.author = author;
      this.render();
    } catch (error) {
      console.error("Error fetching author details:", error);
    }
  }

  render() {
    if (!this.article) return;
    this.shadowRoot.innerHTML = renderUI(this.article, this.isExpanded, this.isSelected);
    this.addCardClickListener();
  }

  addCardClickListener() {
    if (!this.isSelected) {
      const articleCard = this.shadowRoot.querySelector('.article-card');
      articleCard.addEventListener('click', () => {
        this.isExpanded = true;
        this.isSelected = true;
        this.render();
        const articlesListComponent = document.querySelector('articles-list');
        articlesListComponent.showSelectedArticle(this.article.id);
      });
    }
  }
}

customElements.define('article-component', ArticleComponent);