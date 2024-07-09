/**
 * Formats a given date string into a specific format.
 *
 * @param {string} dateString - The date string to be formatted.
 * @returns {string} - The formatted date string.
 */
export function formatDate(dateString) {
  if (!dateString) return "fecha no disponible";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "fecha no válida";
  const day = date.getDate();
  const monthNames = [
    'ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.',
    'ago.', 'sep.', 'oct.', 'nov.', 'dic.'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} de ${month} de ${year} • ${minutes} min read`;
}

/**
 * Truncates a given bio to a specified length.
 *
 * @param {string} bio - The bio to be truncated.
 * @param {number} [length=100] - The maximum length of the truncated bio. Defaults to 100.
 * @returns {string} - The truncated bio, if it exceeds the specified length, with ellipsis appended.
 */
export function truncateBio(bio, length = 100) {
  return bio.length > length ? `${bio.substring(0, length)}...` : bio;
}