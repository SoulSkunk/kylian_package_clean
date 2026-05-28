/**
 * @fileoverview Fonctions de validation du formulaire d'inscription.
 * Ce module regroupe toutes les règles de validation métier :
 * format des noms/prénoms, email, code postal français et âge minimum.
 * @module validators
 */

/** @type {RegExp} */
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ '\-]+$/;

/** @type {RegExp} */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** @type {RegExp} */
const zipcodeRegex = /^[0-9]{5}$/;

/**
 * Calcule l'âge en années entières à partir d'une date de naissance.
 *
 * @param {string} dateString - Date de naissance au format ISO (YYYY-MM-DD).
 * @returns {number} L'âge en années, ou -1 si la date est invalide ou absente.
 *
 * @example
 * calculateAge("1990-05-20"); // retourne l'âge actuel depuis 1990
 * calculateAge("");           // retourne -1
 * calculateAge("invalid");    // retourne -1
 */
export function calculateAge(dateString) {
  if (!dateString) return -1;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return -1;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return age;
}

/**
 * Vérifie si une personne est majeure (18 ans ou plus) à partir de sa date de naissance.
 *
 * @param {string} dateString - Date de naissance au format ISO (YYYY-MM-DD).
 * @returns {boolean} `true` si l'âge est ≥ 18, `false` sinon ou si la date est invalide.
 *
 * @example
 * isAdult("2000-01-01"); // true si la personne a déjà eu 18 ans
 * isAdult("2015-01-01"); // false (mineur)
 * isAdult("");           // false
 */
export function isAdult(dateString) {
  if (!dateString) {
    return false;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  const minBirthDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );

  return date <= minBirthDate;
}

/**
 * Vérifie si un nom ou prénom est valide.
 * Autorise les lettres (avec accents, trémas, cédilles), tirets, apostrophes et espaces.
 * La valeur doit comporter au moins 2 caractères non-vides.
 *
 * @param {string} value - Le nom ou prénom à valider.
 * @returns {boolean} `true` si le nom est valide, `false` sinon.
 *
 * @example
 * isValidName("Jean");       // true
 * isValidName("Anne-Marie"); // true
 * isValidName("François");   // true
 * isValidName("Jean123");    // false
 * isValidName("A");          // false (trop court)
 */
export function isValidName(value) {
  return Boolean(
    value && nameRegex.test(value.trim()) && value.trim().length >= 2,
  );
}

/**
 * Vérifie si une adresse email est valide.
 *
 * @param {string} value - L'adresse email à valider.
 * @returns {boolean} `true` si l'email est valide, `false` sinon.
 *
 * @example
 * isValidEmail("user@example.com");     // true
 * isValidEmail("invalid-email");        // false
 */
export function isValidEmail(value) {
  return Boolean(value && emailRegex.test(value.trim()));
}

/**
 * Vérifie si un code postal est au format français (exactement 5 chiffres).
 *
 * @param {string} value - Le code postal à valider.
 * @returns {boolean} `true` si le format est valide, `false` sinon.
 *
 * @example
 * isValidZipcode("75001"); // true
 * isValidZipcode("7500");  // false (4 chiffres)
 * isValidZipcode("7500A"); // false (lettre)
 */
export function isValidZipcode(value) {
  return Boolean(value && zipcodeRegex.test(value.trim()));
}

/**
 * Valide l'ensemble des champs du formulaire d'inscription.
 * Retourne un objet d'erreurs dont les clés correspondent aux champs invalides.
 *
 * @param {Object} values - Les valeurs du formulaire.
 * @param {string} values.firstName - Prénom de l'utilisateur.
 * @param {string} values.lastName - Nom de l'utilisateur.
 * @param {string} values.email - Adresse email de l'utilisateur.
 * @param {string} values.birthdate - Date de naissance au format YYYY-MM-DD.
 * @param {string} values.city - Ville de résidence.
 * @param {string} values.zipcode - Code postal au format français.
 * @returns {Object} Un objet `{ [champ]: "message d'erreur" }` — vide si tout est valide.
 *
 * @example
 * const errors = validateForm({ firstName: "A", ... });
 * // errors.firstName === "Prénom invalide"
 */
export function validateForm(values) {
  const errors = {};

  if (!isValidName(values.firstName)) {
    errors.firstName = "Prénom invalide";
  }

  if (!isValidName(values.lastName)) {
    errors.lastName = "Nom invalide";
  }

  if (!isValidEmail(values.email)) {
    errors.email = "Email invalide";
  }

  if (!values.birthdate) {
    errors.birthdate = "Date de naissance requise";
  } else if (!isAdult(values.birthdate)) {
    errors.birthdate = "Vous devez avoir 18 ans ou plus";
  }

  if (!values.city || values.city.trim().length < 2) {
    errors.city = "Ville invalide";
  }

  if (!isValidZipcode(values.zipcode)) {
    errors.zipcode = "Code postal invalide";
  }

  return errors;
}
