// Define a custom element for displaying a list of articles
class ArticlesListComponent extends HTMLElement {
  constructor() {
    super();
    // Create a shadow DOM for encapsulation
    this.attachShadow({ mode: "open" });
    // Initialize component state
    this.articles = [];
    this.authorName = "";
    this.currentPage = 1;
    this.articlesPerPage = 3;
    this.isLoading = false;
    this.selectedAuthorId = null;
  }

  // Specify which attributes should be observed for changes
  static get observedAttributes() {
    return ["author-id", "author-name"];
  }

  // Handle changes to observed attributes
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "author-id") {
      // Update selected author and fetch their articles
      this.selectedAuthorId = newValue;
      this.fetchArticles(newValue);
    }
    if (name === "author-name") {
      // Update author name and re-render UI
      this.authorName = newValue;
      this.renderUI();
    }
  }

  // Set up component when it's added to the DOM
  connectedCallback() {
    this.fetchInitialArticles();
    this.setupInfiniteScroll();
  }

  // Fetch the first batch of articles
  async fetchInitialArticles() {
    if (!this.selectedAuthorId) {
      try {
        // Fetch articles from the API
        const response = await fetch(
          `https://5fb46367e473ab0016a1654d.mockapi.io/articles?page=${this.currentPage}&limit=${this.articlesPerPage}`
        );
        const data = await response.json();
        this.articles = data;
        this.renderUI();
      } catch (error) {
        console.error("Error fetching initial articles:", error);
      }
    }
  }

  // Fetch more articles when scrolling
  async fetchMoreArticles() {
    // Don't fetch if already loading or if an author is selected
    if (this.isLoading || this.selectedAuthorId) return;

    this.isLoading = true;
    try {
      // Fetch next page of articles
      const response = await fetch(
        `https://5fb46367e473ab0016a1654d.mockapi.io/articles?page=${this.currentPage + 1}&limit=${this.articlesPerPage}`
      );
      const data = await response.json();
      // Add new articles to existing ones
      this.articles = [...this.articles, ...data];
      this.currentPage++;
      this.renderUI();
    } catch (error) {
      console.error("Error fetching more articles:", error);
    } finally {
      this.isLoading = false;
    }
  }

  // Fetch articles for a specific author
  async fetchArticles(authorId) {
    try {
      const response = await fetch(
        `https://5fb46367e473ab0016a1654d.mockapi.io/users/${authorId}/articles`
      );
      const data = await response.json();
      this.articles = data;
      this.renderUI();
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }

  // Set up infinite scrolling
  setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
      // Check if we've scrolled near the bottom of the page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        this.fetchMoreArticles();
      }
    });
  }

  // Render the component's UI
  renderUI() {
    // Create article components for each article
    const articleComponents = this.articles
      .map(
        (article) =>
          `<article-component article='${JSON.stringify(
            article
          )}'></article-component>`
      )
      .join("");

    // Set the component's HTML content
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        @import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        .hidden {
          display: none;
        }
      </style>
      <div class="articles-list p-4 flex flex-row justify-center items-center gap-5 flex-wrap">
        ${articleComponents}
      </div>
    `;
  }

  // Clear all articles and reset to initial state
  clearArticles() {
    this.authorName = "";
    this.articles = [];
    this.selectedAuthorId = null;
    this.currentPage = 1;
    this.fetchInitialArticles();
  }
  // Show only the selected article
  showSelectedArticle(selectedArticleId) {
    const articleComponents = this.shadowRoot.querySelectorAll('article-component');
    articleComponents.forEach((articleComponent) => {
      const article = JSON.parse(articleComponent.getAttribute('article'));
      // Display only the selected article, hide others
      articleComponent.style.display = article.id === selectedArticleId ? 'block' : 'none';
    });
  }
}

// Register the custom element
customElements.define("articles-list", ArticlesListComponent);