class AuthorComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.loading = true;
    this.authors = [];
    this.maxAuthors = 6;
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
  }

  //*Quotes*//
  //Sorry for your eyes, but try to set tailwindcss :c but.... It didn't work for me lol
  renderUI() {
    const authorCards = this.authors
      .slice(0, this.maxAuthors)
      .map((author) => {
        return `
        <div class="author-card 
                    relative 
                  bg-white
                    shadow-md 
                    rounded-lg 
                    p-4 
                    max-w-sm 
                    flex 
                    items-center
                    gap-4 
                    transition-transform 
                    transform hover:scale-105" 
                    data-author-id="${
          author.id
        }">
          <img class="author-avatar 
                      w-10 h-10 
                      rounded-full 
                      cursor-pointer" 
                      src="${
            author.avatar
          }" alt="${author.name} Avatar" data-author-id="${author.id}" />
          <div class="font-medium dark:text-white">
            <div class="author-name
                      text-blue-500 
                        underline 
                        cursor-pointer" 
                        data-author-id="${
              author.id
            }">${author.name}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">${
              author.bio ? this.truncateBio(author.bio, 50) : "No bio available"
            }</div>
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
          <button class="home-button 
                      bg-blue-500 
                      text-white 
                        px-4 py-2 mb-4
                        rounded 
                        ">
                        Home
          </button>
          ${
            this.maxAuthors < this.authors.length
              ? '<button class="load-more bg-blue-500 text-white px-4 py-2 rounded mt-4">Load More</button>'
              : ""
          }
        </div>
        
        <div class="flex flex-wrap justify-center gap-4">
          ${
            this.loading ? '<p class="text-center">Loading...</p>' : authorCards
          }
        </div>
      </div>
    `;


    //I didnt know the potential of Shadow Dom//

    // This section handles event listeners for author selection and button clicks
    // Select all author names and avatars within the shadow DOM
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

    //Find the home button within the shadow DOM
    const homeButton = this.shadowRoot.querySelector(".home-button");
    homeButton.addEventListener("click", () => this.showAllAuthors());
    
    const loadMoreButton = this.shadowRoot.querySelector(".load-more");
    //logic time  If the load-more button exists
    if (loadMoreButton) {
      loadMoreButton.addEventListener("click", () => {
        this.loadMoreAuthors();
        const articlesListComponent = document.querySelector("articles-list");
        articlesListComponent.clearArticles();
      });
    }
  }

  //Its simple Load more Authores
  loadMoreAuthors() {
    this.maxAuthors += 5;
    this.renderUI();
  }

  //in the moment the user clicked a perfil hide the others authors
  hideOtherAuthors(selectedAuthorId) {
    this.shadowRoot.querySelectorAll(".author-card").forEach((card) => {
      const authorId = card.dataset.authorId;
      card.classList.toggle("hidden", authorId !== selectedAuthorId);
    });
  }

  //Initially, it shows 6 authors by default since 5 is not symmetrical
  showAllAuthors() {
    this.maxAuthors = 6;
    this.renderUI();

    const articlesListComponent = document.querySelector("articles-list");
    articlesListComponent.clearArticles();
  }

  //I decided to shorten the bio as it was exaggeratedly long and not very polished
  truncateBio(bio, length = 55) {
    return bio.length > length ? bio.substring(0, length) + "..." : bio;
  }

  //It's time to bring in the data clap clap
  async fetchData() {
    try {
      // Fetch user data from a mock API endpoint
      const response = await fetch(
        `https://5fb46367e473ab0016a1654d.mockapi.io/users`
      );
      // Parse the response as JSON
      const data = await response.json();
      // Create an array to store promises for fetching articles
      const authorPromises = data.map(async (author) => {
        try {
          // For each author, fetch their latest article from another API endpoint
          const articlesResponse = await fetch(
            `https://5fb46367e473ab0016a1654d.mockapi.io/users/${author.id}/articles?limit=1&sortBy=publishedAt&order=desc`
          );
          //parse JSON
          const articles = await articlesResponse.json();
           // If articles exist, assign the first article likely the latest to the author's 'lastArticle' property
          author.lastArticle = articles[0] || null;
          //catching error time
        } catch (error) {
          console.error(
            `Error fetching articles for author ${author.id}:`,
            error
          );
           // Set the author's lastArticle to null if fetching articles fails
          author.lastArticle = null;
        }
        //Return the updated author object with potentially populated lastArticle property
        return author;
      });

      //Wait for all article fetching promises to resolve
      this.authors = await Promise.all(authorPromises);
      //Update the loading state to indicate data is fetched
      this.loading = false;
      //Re-render the UI to reflect the fetched data authors and potentially their latest articles
      this.renderUI();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

//author-component is why use in the html
customElements.define("author-component", AuthorComponent);
