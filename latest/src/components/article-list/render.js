/**
 * Renders the user interface for a list of articles.
 *
 * @param {Array} articles - An array of article objects.
 * @returns {string} - The HTML representation of the rendered UI.
 */
export function renderUI(articles) {
  const articleComponents = articles
    .map(
      (article) =>
        `<article-component article='${JSON.stringify(
          article
        )}'></article-component>`
    )
    .join("");

  return /*html*/ `
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