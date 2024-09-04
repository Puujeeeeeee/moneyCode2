// utils/stringExtensions.js

/**
 * Capitalizes the first character of the string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
export function capitalizeCustom(str) {
  if (str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Gets the first 3 characters of the string.
 * @param {string} str - The string from which to get the first 3 characters.
 * @returns {string} - The first 3 characters.
 */
export function first3(str) {
  return str.substring(0, 3);
}

/**
 * Gets the first 5 characters of the string.
 * @param {string} str - The string from which to get the first 5 characters.
 * @returns {string} - The first 5 characters.
 */
export function lastSplice3(str) {
  return str.substring(0, 5);
}
