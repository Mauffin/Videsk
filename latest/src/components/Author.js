class AuthorComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.loading = true;
    this.authors = [];
    this.maxAuthors = 6;
    this.filteredAuthors = []; 
   
  }

  // This function defines which attributes of the component should be observed for changes.
  // In this case, we only care about the 'loading' attribute.
  static get observedAttributes() {
    return ["loading"];
  }

  // This function is called whenever an observed attribute (in this case, 'loading') changes.
  // Here, it checks if the changed attribute is loading and updates the internal state (this.loading)
  // based on the new value. If the loading state changes, it triggers a re-render of the UI (this.renderUI())
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "loading") {
      // Set loading state based on attribute value (presence/absence)
      // Re-render UI to reflect the loading state change
      this.loading = newValue !== null;
      this.renderUI();
    }
  }

  // This function is called when the component is inserted into the DOOM.
  // It's a common place to perform initial setup tasks.
  // Here, it calls this.renderUI() to display the initial UI and this.fetchData() to fetch author data.
  connectedCallback() {
    this.renderUI();
    this.fetchData();

    const searchInput = document.querySelector("#search-input");
    searchInput.addEventListener('input', (event) => this.filterAuthors(event.target.value));

    const homeButton = document.querySelector(".home-button");
    homeButton.addEventListener("click", () => this.showAllAuthors());

    const loadMoreButton = document.querySelector(".load-more");
    loadMoreButton.addEventListener("click", () => this.loadMoreAuthors());
    
  }
  

  //*Quotes*//
  //Sorry for your eyes, but try to set tailwindcss :c but.... It didn't work for me lol
  //@apply dont work :c
  renderUI() {
    const authorsToDisplay = this.filteredAuthors.length > 0 ? this.filteredAuthors : this.authors;
    const authorCards = authorsToDisplay
      .slice(0, this.maxAuthors)
      .map((author) => {
        return /*html*/`
        <div class="author-card relative bg-white shadow-md rounded-lg p-4 max-w-sm flex items-center gap-4 transition-transform transform hover:scale-105" data-author-id="${author.id}">
    <img class="author-avatar w-12 h-12 rounded-full cursor-pointer" src="${author.avatar}" alt="${author.name} Avatar" data-author-id="${author.id}" />

    <div class="font-medium dark:text-white">
        <div class="author-name text-blue-500 underline cursor-pointer" data-author-id="${author.id}">${author.name}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
            Birthdate: ${this.formatDate(author.birthdate)}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
            Bio: ${author.bio.length > 50 ? author.bio.substring(0, 50) + "..." : author.bio}
        </div>
    </div>
</div>

      `;
      })
      .join("");

     /*use extension es6-string-html is more...gorgeous*/
     //shadowdoom
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        @import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
        .hidden {
          display: none;
        }
        .author-card { transition: transform 0.3s ease; }
        .author-card:hover { transform: scale(1.05); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
      </style>

    <div class="flex flex-wrap justify-center align-middle items-center gap-4 author-list">
    ${this.loading ? `
      <div class="flex justify-center ">
      <button type="button" class="flex items-center bg-blue-600 text-white px-4 py-2 rounded " disabled>
        <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2a10 10 0 00-10 10h2a8 8 0 118 8v2a10 10 0 100-20z"></path>
        </svg>
        Loading...
      </button>
      </div>
    ` : authorCards}
  </div>
    `;


    /*I didnt know the potential of Shadow Dom

    This section handles event listeners for author selection and button clicks
    Select all author names and avatars within the shadow DOM*/ 
    this.shadowRoot
      .querySelectorAll(".author-name, .author-avatar")
      .forEach((element) => {
        element.addEventListener("click", (event) => {
          const authorId = event.target.dataset.authorId;
          const authorName = event.target.textContent;
          const articlesListComponent = document.querySelector("articles-list");
          articlesListComponent.setAttribute("author-id", authorId);
          articlesListComponent.setAttribute("author-name", authorName);

          //Call the hideOtherAuthors function to hide other author cards
          this.hideOtherAuthors(authorId);
        });
      });


      const loadMoreButton = document.querySelector(".load-more");
      if (this.maxAuthors < authorsToDisplay.length) {
        loadMoreButton.classList.remove("hidden");
      } else {
        loadMoreButton.classList.add("hidden");
      }
    }

  //Its simple Load more Authores
  loadMoreAuthors() {
    this.maxAuthors += 6;
    this.renderUI();
  }

  //in the moment the user clicked a perfil hide the others authors
  hideOtherAuthors(selectedAuthorId) {
    const authorCards = this.shadowRoot.querySelectorAll(".author-card");
    
    authorCards.forEach((card) => {
      const authorId = card.dataset.authorId;
      card.classList.toggle("hidden", authorId !== selectedAuthorId);
    });
    
  }
  
  //Initially, it shows 6 authors by default since 5 is not symmetrical
  showAllAuthors() {
    this.maxAuthors = 6;
    this.filteredAuthors = [];
    this.renderUI();
    const articlesListComponent = document.querySelector("articles-list");
    articlesListComponent.clearArticles();
  }

  filterAuthors(searchParam) {
    this.filteredAuthors = this.authors.filter(author => 
      author.name.toLowerCase().includes(searchParam.toLowerCase())
    );
    this.maxAuthors = 6; // Reset to show initial number of authors
    this.updateAuthorList();
  }

  /* The updateAuthorList function is used to update only the list of authors
   instead of re-rendering the entire component, thus preventing the search field 
  from losing focus.*/ 
  updateAuthorList() {
    const authorsToDisplay = this.filteredAuthors.length > 0 ? this.filteredAuthors : this.authors;
    const authorCards = authorsToDisplay
      .slice(0, this.maxAuthors)
      .map((author) => {
        return `
        <div class="author-card relative bg-white shadow-md rounded-lg p-4 max-w-sm flex items-center gap-4 transition-transform transform hover:scale-105" data-author-id="${author.id}">
    <img class="author-avatar w-12 h-12 rounded-full cursor-pointer" src="${author.avatar}" alt="${author.name} Avatar" data-author-id="${author.id}" />

    <div class="font-medium dark:text-white">
        <div class="author-name text-blue-500 underline cursor-pointer" data-author-id="${author.id}">${author.name}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
            Birthdate: ${author.birthdate}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
            Bio: ${author.bio.length > 50 ? author.bio.substring(0, 50) + "..." : author.bio}
        </div>
    </div>
</div>
      `;
      })
      .join("");

    const authorList = this.shadowRoot.querySelector(".author-list");
    authorList.innerHTML = authorCards;

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
      const loadMoreButton = document.querySelector(".load-more");
      if (this.maxAuthors < authorsToDisplay.length) {
        loadMoreButton.classList.remove("hidden");
      } else {
        loadMoreButton.classList.add("hidden");
      }
  }
  //It's time to bring in the data clap clap
  async fetchData() {
     // Define a key for storing and retrieving data from local storage
    const cacheKey = 'authorData';
     // Try to retrieve cached data from localStorage
    const cachedData = localStorage.getItem(cacheKey);

    // If cached data is available, use it instead of making an API request
    if (cachedData) {
      // Parse cached data from JSON and assign it to this.authors
      this.authors = JSON.parse(cachedData);
      // Set loading state to false since data is ready
      this.loading = false;
      // Render the UI with cached data
      this.renderUI();
      //Exit the function since there's no need to make an API request
      return;
    }

    try {
      // Fetch API to get the list of authors
      const response = await fetch(`https://5fb46367e473ab0016a1654d.mockapi.io/users`);
      //Parse
      const data = await response.json();
      //Fetch API to get the list of articles
      const articlesResponse = await fetch(`https://5fb46367e473ab0016a1654d.mockapi.io/articles`);
      const allArticles = await articlesResponse.json();

      // Map over authors to combine author information with their articles
      this.authors = data.map(author => {
         // Filter articles belonging to the current author
        const authorArticles = allArticles.filter(article => article.userId === author.id);
        return {
           // Filter articles belonging to the current author
          ...author,
          lastArticle: authorArticles[0] || null,
          birthdate: author.birthdate || "No disponible",
          bio: author.bio || "No disponible"
        };
      });

       // Filter articles belonging to the current author
      localStorage.setItem(cacheKey, JSON.stringify(this.authors));

      
      this.loading = false;
      this.renderUI();
    } catch (error) {
      console.error("Error fetching data:", error);
      this.loading = false;
      this.renderUI();
    }
  }


  formatDate(dateString) {
    if (!dateString) return "fecha no disponible";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "fecha no valida";
    const day = date.getDate();
    const monthNames = [
      'ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.',
      'ago.', 'sep.', 'oct.', 'nov.', 'dic.'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year} `;
  }


}

//author-component is why use in the html
customElements.define("author-component", AuthorComponent);
