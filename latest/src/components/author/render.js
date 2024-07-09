/**
 * Renders the UI based on the given state and formatDate function.
 *
 * @param {object} state - The state object containing authors and other UI related data.
 * @param {function} formatDate - The function used to format the date.
 * @returns {string} - The HTML string representing the rendered UI.
 */
export function renderUI(state, formatDate) {
  const authorsToDisplay = state.filteredAuthors.length > 0 ? state.filteredAuthors : state.authors;
  const authorCards = authorsToDisplay
    .slice(0, state.maxAuthors)
    .map((author) => createAuthorCard(author, formatDate))
    .join("");

  return /*html*/ `
    <style>
      @import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
      .hidden { display: none; }
      .author-card { transition: transform 0.3s ease; }
      .author-card:hover { transform: scale(1.05); }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .fade-in { animation: fadeIn 0.5s ease forwards; }
    </style>
    <div class="flex flex-wrap justify-center align-middle items-center gap-4 author-list">
      ${state.loading ? createLoadingSpinner() : authorCards}
    </div>
  `;
}

/**
 * Updates the author list in the shadow root with the given state.
 *
 * @param {ShadowRoot} shadowRoot - The shadow root element to update the author list in.
 * @param {Object} state - The state object containing the authors and filtered authors.
 * @param {function} formatDate - The function to format the date of the authors.
 *
 * @return {void}
 */
export function updateAuthorList(shadowRoot, state, formatDate) {
  const authorsToDisplay = state.filteredAuthors.length > 0 ? state.filteredAuthors : state.authors;
  const authorCards = authorsToDisplay
    .slice(0, state.maxAuthors)
    .map((author) => createAuthorCard(author, formatDate))
    .join("");

  const authorList = shadowRoot.querySelector(".author-list");
  authorList.innerHTML = authorCards;
}

/**
 * Creates an author card HTML element.
 *
 * @param {Object} author - The author object containing author details.
 * @param {Function} formatDate - The function used to format the author's birthdate.
 * @returns {string} - The HTML code for the author card.
 */
function createAuthorCard(author, formatDate) {
  return /*html*/`
    <div class="author-card relative bg-white shadow-md rounded-lg p-4 max-w-sm flex items-center gap-4 transition-transform transform hover:scale-105" data-author-id="${author.id}">
      <img class="author-avatar w-12 h-12 rounded-full cursor-pointer" src="${author.avatar}" alt="${author.name} Avatar" data-author-id="${author.id}" />
      <div class="font-medium dark:text-white">
        <div class="author-name text-blue-500 underline cursor-pointer" data-author-id="${author.id}">${author.name}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Birthdate: ${formatDate(author.birthdate)}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Bio: ${author.bio.length > 50 ? author.bio.substring(0, 50) + "..." : author.bio}
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates a loading spinner HTML element.
 *
 * @returns {string} The HTML code for the loading spinner.
 */
function createLoadingSpinner() {
  return /*html*/`
    <div class="flex justify-center ">
      <button type="button" class="flex items-center bg-blue-600 text-white px-4 py-2 rounded " disabled>
        <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2a10 10 0 00-10 10h2a8 8 0 118 8v2a10 10 0 100-20z"></path>
        </svg>
        Loading...
      </button>
    </div>
  `;
}