/**
 * Determines the environment locale in a platform-independent way
 *
 * @returns a standard name for the language, such as 'en-US'. The first code corresponds to the language
 */
export const determineLocale = () =>
    Intl.DateTimeFormat().resolvedOptions().locale;

/**
 * Determines the environment language
 *
 * @returns a two-character standard name for the language, such as 'en'
 */
export const determineLanguage = () => determineLocale().split("-")[0];
