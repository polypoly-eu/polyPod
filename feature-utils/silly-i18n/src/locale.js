/**
 * Determine the environment's locale.
 *
 * @function
 * @returns {string} The current locale, e.g. `en-US`.
 */
export const determineLocale = () =>
    Intl.DateTimeFormat().resolvedOptions().locale;

/**
 * Determine the environment's language.
 *
 * @function
 * @return {string} - The two-character standard name for the language,
 * e.g. 'en'.
 */
export const determineLanguage = () => determineLocale().split("-")[0];
