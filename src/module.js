/**
 * @fileoverview Utilitaires généraux du formulaire d'inscription.
 * @module module
 */

/**
 * Formate une date ISO (YYYY-MM-DD) en date lisible en français.
 *
 * @param {string} dateString - Date au format ISO YYYY-MM-DD.
 * @returns {string} La date formatée (ex: "20 mai 1990"), ou une chaîne vide si invalide.
 *
 * @example
 * formatDate("1990-05-20"); // "20 mai 1990"
 * formatDate("");           // ""
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Capitalise la première lettre d'une chaîne de caractères.
 *
 * @param {string} str - La chaîne à capitaliser.
 * @returns {string} La chaîne avec la première lettre en majuscule, ou chaîne vide si invalide.
 *
 * @example
 * capitalize("jean");  // "Jean"
 * capitalize("");      // ""
 */
export function capitalize(str) {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
