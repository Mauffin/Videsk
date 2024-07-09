const API_BASE_URL = 'https://5fb46367e473ab0016a1654d.mockapi.io';

/**
 * Fetches the initial articles from the API.
 *
 * @param {number} page - The page number of articles to fetch.
 * @param {number} limit - The maximum number of articles per page.
 * @returns {Promise<any>} - A Promise that resolves with the fetched articles.
 */
export async function fetchInitialArticles(page, limit) {
  const response = await fetch(
    `${API_BASE_URL}/articles?page=${page}&limit=${limit}`
  );
  return await response.json();
}

/**
 * Fetches more articles from the server.
 *
 * @param {number} page - The page number of the articles to fetch.
 * @param {number} limit - The maximum number of articles to fetch per page.
 * @returns {Promise<any>} - A promise that resolves with the fetched articles.
 */
export async function fetchMoreArticles(page, limit) {
  const response = await fetch(
    `${API_BASE_URL}/articles?page=${page}&limit=${limit}`
  );
  return await response.json();
}

/**
 * Fetches articles by author ID from the API.
 *
 * @param {number} authorId - ID of the author whose articles to fetch.
 * @returns {Promise<any>} - A promise that resolves to the fetched articles.
 */
export async function fetchArticles(authorId) {
  const response = await fetch(
    `${API_BASE_URL}/users/${authorId}/articles`
  );
  return await response.json();
}

/**
 * Fetches authors from the mock API.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of authors with additional information.
 */
export async function fetchAuthors() {
  const response = await fetch(`${API_BASE_URL}/users`);
  const authors = await response.json();
  const articlesResponse = await fetch(`${API_BASE_URL}/articles`);
  const allArticles = await articlesResponse.json();

  return authors.map(author => {
    const authorArticles = allArticles.filter(article => article.userId === author.id);
    return {
      ...author,
      lastArticle: authorArticles[0] || null,
      birthdate: author.birthdate || "No disponible",
      bio: author.bio || "No disponible"
    };
  });
}