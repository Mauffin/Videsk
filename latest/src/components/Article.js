class ArticleComponent extends HTMLElement {
  constructor() {
    super();
    // Create a shadow DOM with open mode content visible outside
    this.attachShadow({ mode: 'open' });
    //Initialize properties
    this.article = null;
    this.isExpanded = false;
  }

  //Defines attributes to be observed for changes
  static get observedAttributes() {
    //Observe article attribute changes
    return ['article'];
  }

   //handles attribute changes (similar to getters/setters)
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'article') {
      //If the changed attribute is article
      this.article = JSON.parse(newValue);//parse
      //re-render the UI with the updated article
      this.renderUI();
    }
  }
  
  //Called when the component is inserted into the DOM
  connectedCallback() {
    this.renderUI();
  }

  //Renders the UI using the article data
  renderUI() {
    // Don't render if no article data
    if (!this.article) return;

    //I decided to shorten the bio as it was exaggeratedly long and not very polished
    const truncatedDesc = this.article.description.length > 100 ? `${this.article.description.substring(0, 100)}...` : this.article.description;

    /*use extension es6-string-html is more...georgeos*/
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

    // Get references to DOM elements for interaction
    const articleCard = this.shadowRoot.querySelector('.article-card');
    const articleContent = this.shadowRoot.querySelector('.article-content');

     // Add click event listener to toggle content expansion
    articleCard.addEventListener('click', () => {
      // Toggle expansion state
      this.isExpanded = !this.isExpanded;
      // Show/hide content based on state
      articleContent.classList.toggle('hidden', !this.isExpanded);
    });
  }
}

customElements.define('article-component', ArticleComponent);