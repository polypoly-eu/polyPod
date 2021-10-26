/**
 * Current solution for detecting the language of an ad description.
 *
 * We use the title of the ads category to detect the language
 * by comparing it to a list of knows titles.
 */
export const AD_LOCALE = {
    de: {
        category: "Werbeanzeigen",
        nameRegex: /^Werbeanzeige von (.+)$/,
    },
    en: {
        category: "Ads",
        nameRegex: /^Ad by (.+)$/,
    },
    // Danish
    da_DK: {
        category: "Annoncer",
        nameRegex: /^Annonce af (.+)$/,
    },
};

/**
 * Attempt to detect the locale in which the given category name is written.
 */
export function localeForCategoyName(categoryName) {
    return Object.values(AD_LOCALE).find(
        (each) => each.category === categoryName
    );
}

export function extractNameFromAdDescription(description, locale) {
    const match = description.match(locale.nameRegex);
    if (match && match.length === 2) {
        return match[1];
    }
    return description;
}
