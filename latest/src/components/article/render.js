import { formatDate, truncateBio } from '../../utils.js';

export function renderUI(article, isExpanded, isSelected) {
  const truncatedDesc = article.description.length > 100 ? `${article.description.substring(0, 100)}...` : article.description;
  const formattedDate = formatDate(article.publishedAt);
  const authorImage = article.author ? article.author.avatar : '';
  const authorName = article.author ? article.author.name : '';

  const smallCard = `
    <div class="article-card max-w-xs bg-white rounded-lg cursor-pointer">
      <img class="rounded-t-lg w-full" src="${article.image}" alt="${article.title}" />
      <div class="p-4">
        <h1 class="font-sans font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900">${article.title}</h1>
        <p class="mb-2 font-sans font-normal text-sm sm:text-base lg:text-lg text-justify text-gray-600">${truncatedDesc}</p>
        <p class="pl-3 font-sans font-normal text-xs sm:text-sm lg:text-base text-gray-500">${formattedDate}</p>
      </div>
    </div>
  `;

  const largeCard = `
    <div class="article-card max-w-5xl bg-white rounded-lg p-4 sm:p-6 lg:p-8">
      <p class="font-sans font-semibold text-md text-blue-400 dark:text-gray-400">${article.company}</p>
      <h1 class="mb-1 font-sans font-normal text-2xl sm:text-3xl lg:text-5xl text-gray-900 dark:text-gray-400">${article.title}</h1>
      <p class="mb-4 font-sans font-normal text-md text-gray-400 dark:text-gray-400">${formattedDate}</p>
      <div class="p-1">
        <div class="flex justify-center">
          <img class="rounded-t-lg mb-5 max-w-full" src="${article.image}" alt="${article.title}" />
        </div>
        <p class="mb-3 font-sans font-medium text-md sm:text-lg lg:text-xl text-justify text-gray-700 dark:text-gray-400">${article.description}</p>
        <p class="font-sans font-medium text-md sm:text-lg lg:text-xl text-justify text-gray-600 dark:text-gray-400">${article.content}</p>
      </div>
    </div>
  `;

  return `
    <style>
      @import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    </style>
    ${isExpanded ? largeCard : smallCard}
  `;
}