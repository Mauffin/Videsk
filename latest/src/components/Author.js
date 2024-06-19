class AuthorComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.loading = true;
    this.authors = [];
    this.maxAuthors = 6;
  }

  static get observedAttributes() {
    return ['loading'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'loading') {
      this.loading = newValue !== null;
      this.renderUI();
    }
  }

  //
  connectedCallback() {
    this.renderUI();
    this.fetchData();
  }

  //Sorry but I try to set the tailwindcss :c but.... it didn't work for me lol
  //
  renderUI() {
    const authorCards = this.authors.slice(0, this.maxAuthors).map(author => {
      return `
        <div class="author-card relative bg-white shadow-md rounded-lg p-4 max-w-sm flex items-center gap-4 transition-transform transform hover:scale-105" data-author-id="${author.id}">
          <img class="author-avatar w-10 h-10 rounded-full cursor-pointer" src="${author.avatar}" alt="${author.name} Avatar" data-author-id="${author.id}" />
          <div class="font-medium dark:text-white">
            <div class="author-name text-blue-500 underline cursor-pointer" data-author-id="${author.id}">${author.name}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">${author.bio ? this.truncateBio(author.bio, 50) : 'No bio available'}</div>
          </div>
        </div>
      `;
    }).join('');

    //shadow dooom
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        @import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        .hidden {
          display: none;
        }
        .author-card {
          transition: transform 0.3s ease;
        }
        .author-card:hover {
          transform: scale(1.05);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
      </style>
    
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-row justify-end items-baseline gap-2">
          <button class="home-button bg-blue-500 text-white px-4 py-2 rounded mb-4">Home</button>
          ${this.maxAuthors < this.authors.length ? '<button class="load-more bg-blue-500 text-white px-4 py-2 rounded mt-4">Load More</button>' : ''}
        </div>
        
        <div class="flex flex-wrap justify-center gap-4">
          ${this.loading ? '<p class="text-center">Loading...</p>' : authorCards}
        </div>
      </div>
    `;

    //more shadoow doom  
    this.shadowRoot.querySelectorAll('.author-name, .author-avatar').forEach(element => {
      element.addEventListener('click', (event) => {
        const authorId = event.target.dataset.authorId;
        const authorName = event.target.textContent;
        const articlesListComponent = document.querySelector('articles-list');
        articlesListComponent.setAttribute('author-id', authorId);
        articlesListComponent.setAttribute('author-name', authorName);
        this.hideOtherAuthors(authorId);
      });
    });

    const homeButton = this.shadowRoot.querySelector('.home-button');
    homeButton.addEventListener('click', () => this.showAllAuthors());

    const loadMoreButton = this.shadowRoot.querySelector('.load-more');
    if (loadMoreButton) {
      loadMoreButton.addEventListener('click', () => {
        this.loadMoreAuthors();
        const articlesListComponent = document.querySelector('articles-list');
        articlesListComponent.clearArticles(); // Limpiar artículos al cargar más
      });
    }
  }

  loadMoreAuthors() {
    this.maxAuthors += 5;
    this.renderUI();
  }

  hideOtherAuthors(selectedAuthorId) {
    this.shadowRoot.querySelectorAll('.author-card').forEach(card => {
      const authorId = card.dataset.authorId;
      card.classList.toggle('hidden', authorId !== selectedAuthorId);
    });
  }

  showAllAuthors() {
    this.maxAuthors = 6;
    this.renderUI();

    const articlesListComponent = document.querySelector('articles-list');
    articlesListComponent.clearArticles(); // Limpiar artículos al regresar a "Home"
  }

  truncateBio(bio, length = 50) {
    return bio.length > length ? bio.substring(0, length) + '...' : bio;
  }

  async fetchData() {
    try {
      const response = await fetch(`https://5fb46367e473ab0016a1654d.mockapi.io/users`);
      const data = await response.json();
      const authorPromises = data.map(async author => {
        try {
          const articlesResponse = await fetch(`https://5fb46367e473ab0016a1654d.mockapi.io/users/${author.id}/articles?limit=1&sortBy=publishedAt&order=desc`);
          const articles = await articlesResponse.json();
          author.lastArticle = articles[0] || null;
        } catch (error) {
          console.error(`Error fetching articles for author ${author.id}:`, error);
          author.lastArticle = null;
        }
        return author;
      });

      this.authors = await Promise.all(authorPromises);
      this.loading = false;
      this.renderUI();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}

customElements.define('author-component', AuthorComponent);