class ArticleComponent extends HTMLElement {
  constructor() {
    super();
    // Create a shadow DOM with open mode content visible outside
    this.attachShadow({ mode: 'open' });
    //Initialize properties
    this.article = null;
    this.isExpanded = false;
    this.isSelected = false;

  }

  //Defines attributes to be observed for changes
  static get observedAttributes() {
    //Observe article attribute changes
    return ['article','author-id'];
  }

   //handles attribute changes (similar to getters/setters)
  attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'article') {
        //If the changed attribute is article
        try {
          this.article = JSON.parse(newValue);//parse
           //re-render the UI with the updated article
          this.renderUI();
        } catch (error) {
          console.error("Error parsing article JSON:", error);
          this.article = null;
        }
      }
      if(name ==="author-id"){
        // If the changed attribute is 'author-id', fetch author details
        this.fetchAuthorDetails(newValue);
      }
  }
  
  //Called when the component is inserted into the DOOOOM.... the game ... bad joke lol
  connectedCallback() {
    this.renderUI();

    // Add event listener for when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
      const articlesButton = document.getElementById('articles-button');
      const articlesListComponent = document.querySelector('articles-list');

    });

  }

   // Fetch author details from the API
  async fetchAuthorDetails(authorId) {
    try {
      const response = await fetch(`https://5fb46367e473ab0016a1654d.mockapi.io/users/${authorId}`);
      const author = await response.json();
      this.article.author = author;
      this.renderUI();
    } catch (error) {
      console.error("Error fetching author details:", error);
    }
  }


  //Renders the UI using the article data
  renderUI() {
    // Don't render if no article data
    if (!this.article) return;
    //I decided to shorten the bio as it was exaggeratedly long and not very polished
    const truncatedDesc = this.article.description.length > 100 ? `${this.article.description.substring(0, 100)}...` : this.article.description;
    const formattedDate = this.formatDate(this.article.publishedAt);
    const authorImage = this.article.author ? this.article.author.avatar : '';
    const authorName = this.article.author ? this.article.author.name : '';
    
    const smallCard = /*html*/`
    <div class="article-card max-w-xs bg-white rounded-lg cursor-pointer  ">
    <img class="rounded-t-lg w-full " src="${this.article.image}" alt="${this.article.title}" /> 
    <div class="p-4">
      <h1 class="font-sans font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900">${this.article.title}</h1>
      <p class="mb-2 font-sans font-normal text-sm sm:text-base lg:text-lg text-justify text-gray-600">${truncatedDesc}</p>
      <p class="pl-3 font-sans font-normal text-xs sm:text-sm lg:text-base text-gray-500">${formattedDate}</p>
    </div>
  </div>
    `;

    const largeCard = /*html*/`
     
    <div class="article-card max-w-5xl bg-white rounded-lg p-4 sm:p-6 lg:p-8">
    <p class="font-sans font-semibold text-md text-blue-400 dark:text-gray-400">${this.article.company}</p>
    <h1 class="mb-1 font-sans font-normal text-2xl sm:text-3xl lg:text-5xl text-gray-900 dark:text-gray-400">${this.article.title}</h1>
    <p class="mb-4 font-sans font-normal text-md text-gray-400 dark:text-gray-400">${formattedDate}</p>
    <div class="p-1">
      <div class="flex justify-center">
        <img class="rounded-t-lg mb-5 max-w-full " src="${this.article.image}" alt="${this.article.title}" />
      </div>
      <p class="mb-3 font-sans font-medium text-md sm:text-lg lg:text-xl text-justify text-gray-700 dark:text-gray-400">${this.article.description}</p>
      <p class="font-sans font-medium text-md sm:text-lg lg:text-xl text-justify text-gray-600 dark:text-gray-400">${this.article.content}</p>
    </div>
    `;

    this.shadowRoot.innerHTML = `
      <style>
        @import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
      </style>
      ${this.isExpanded ? largeCard : smallCard}
    `;

    const articleCard = this.shadowRoot.querySelector('.article-card');
    if (!this.isSelected) {
      articleCard.addEventListener('click', () => {
        this.isExpanded = true;
        this.isSelected = true;
        this.renderUI();
        const articlesListComponent = document.querySelector('articles-list');
        articlesListComponent.showSelectedArticle(this.article.id);
      });
    }
  }
// Helper function to format the date
  formatDate(dateString) {
    if(!dateString) return "fecha no disponible"
    const date = new Date(dateString);
    if(isNaN(date.getTime()))return "fecha no valida";
    const day = date.getDate();
    const monthNames = [
      'ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 
      'ago.', 'sep.', 'oct.', 'nov.', 'dic.'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} de ${month} de ${year} • ${minutes}  min read`;
  }
  // Helper function to truncate the author's bio
  truncateBio(bio, length = 100) {
    return bio.length > length ? `${bio.substring(0, length)}...` : bio;
  }

 
}
// Register the custom element
customElements.define('article-component', ArticleComponent);