class ArticlesListComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.articles = [];
    this.authorName = "";
  }
  // This function defines which attributes of the component should be observed for changes.
  // In this case, we only care about the author-id, author-name attribute.
  static get observedAttributes() {
    return ["author-id", "author-name"];
  }

  // This function is called whenever an observed attribute in this case, author-id author-name changes.
   attributeChangedCallback(name, oldValue, newValue) {
    if (name === "author-id") {
      // If its author-id, call the fetchArticles function with the new value (author ID)
      //Assuming fetchArticle exists to fetch articles based on ID
      this.fetchArticles(newValue); 
    }
    if (name === "author-name") {
      //If its author-name, update the components internal authorName property with the new value
      //Re-render the UI to potentially reflect the change in author name
      this.authorName = newValue;
      this.renderUI();
    }
  }

    // This function is called when the component is inserted into the DOOM.
    // It's a common place to perform initial setup tasks.
    // Here, it calls this.renderUI() to display the initial UI
  connectedCallback() {
    this.renderUI();
  }

  async fetchArticles(authorId) {
    try {
      //EndPoint of mockapi
      const response = await fetch(
        `https://5fb46367e473ab0016a1654d.mockapi.io/users/${authorId}/articles`
      );
      //parse JSON
      const data = await response.json();
      //Update the components internal articles array with the fetched articles data
      this.articles = data;
      //Re-render the UI to potentially display the fetched articles
      this.renderUI();
      //handler !error! !error!
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }

  // This function likely generates the HTML structure for the component based on available data
  renderUI() {
    // Create an array to store HTML strings representing article components
    const articleComponents = this.articles
    // For each article object, create an HTML string for an 'article-component' element
      .map(
        (article) =>
          `<article-component article='${JSON.stringify(
            article
          )}'></article-component>`
      )
      .join("");

    /*use extension es6-string-html is more...gorgeous*/
    //updates the content displayed by a web component,
    //using its shadow DOM, essentially defining the UI structure and styles within the components private DOM tree.
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        @import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        .hidden {
          display: none;
        }
      </style>
      <div class="articles-list p-4 flex flex-col flex-wrap  ">
        <h2 class="author-title text-3xl text-center font-bold mb-4">${this.authorName}</h2>
        
        ${articleComponents}
      </div>
    `;
  }

  //this funtion is awesome is magical its simple but efective
  clearArticles() {
    this.authorName = "";
    this.articles = [];
    this.renderUI();
  }
}

customElements.define("articles-list", ArticlesListComponent);
