class ArticleComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.article = null;
    this.isExpanded = false;
  }

  static get observedAttributes() {
    return ['article'];
  }

  //this is similar a los getters y setters :3
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'article') {
      this.article = JSON.parse(newValue);
      this.renderUI();
    }
  }
  

  connectedCallback() {
    this.renderUI();
  }

  renderUI() {
    if (!this.article) return;

    const truncatedDesc = this.article.description.length > 100 ? `${this.article.description.substring(0, 100)}...` : this.article.description;

    /*use extension es6-string-html is more...beatiful*/
    this.shadowRoot.innerHTML = /* html */`
      <style>
        @import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
      </style>
      <div class="article-card  flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer">
        <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="${this.article.image}" alt="${this.article.title}">
        <div class="flex flex-col justify-between p-4 leading-normal">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${this.article.title}</h5>
                 <p class="mb-1 text-gray-700 dark:text-gray-400">${new Date(this.article.publishedAt).toLocaleDateString()}</p>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${truncatedDesc}</p>
          <div class="article-content hidden">${this.article.content}</div>
        </div>
      </div>
    `;

    const articleCard = this.shadowRoot.querySelector('.article-card');
    const articleContent = this.shadowRoot.querySelector('.article-content');

    articleCard.addEventListener('click', () => {
      this.isExpanded = !this.isExpanded;
      articleContent.classList.toggle('hidden', !this.isExpanded);
    });
  }
}

customElements.define('article-component', ArticleComponent);