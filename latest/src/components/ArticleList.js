class ArticlesListComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.articles = [];
    this.authorName = '';
  }

  static get observedAttributes() {
    return ['author-id', 'author-name'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'author-id') {
      this.fetchArticles(newValue);
    }
    if (name === 'author-name') {
      this.authorName = newValue;
      this.renderUI();
    }
  }

  connectedCallback() {
    this.renderUI();
  }

  async fetchArticles(authorId) {
    try {
      const response = await fetch(`https://5fb46367e473ab0016a1654d.mockapi.io/users/${authorId}/articles`);
      const data = await response.json();
      this.articles = data;
      this.renderUI();
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }

  renderUI() {
    const articleComponents = this.articles.map(article => `<article-component article='${JSON.stringify(article)}'></article-component>`).join('');

    this.shadowRoot.innerHTML = /*html*/`
      <style>
        @import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        .hidden {
          display: none;
        }
      </style>
      <div class="articles-list p-4 ">
        <h2 class="author-title text-3xl font-bold mb-4">${this.authorName}</h2>
        ${articleComponents}
      </div>
    `;
  }
//this funtion is awesome is magical its simple but efective 
  clearArticles() {
    this.authorName = '';
    this.articles = [];
    this.renderUI();
  }
}

customElements.define('articles-list', ArticlesListComponent);