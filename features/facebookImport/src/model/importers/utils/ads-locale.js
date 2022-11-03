/**
 * Current solution for detecting the language of an ad description.
 *
 * We use the title of the ads category to detect the language
 * by comparing it to a list of knows titles.
 * @const AD_LOCALE
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
 * It takes a category name as an argument and returns the locale object that has the same category
 * name.
 * @param categoryName - The name of the category you want to get the locale for.
 * @returns The locale for the category name.
 */
export function localeForCategoyName(categoryName) {
    return Object.values(AD_LOCALE).find(
        (each) => each.category === categoryName
    );
}

/**
 * It extracts the name of the ad from the description
 * @param description - The description of the ad.
 * @param locale - the locale object
 * @returns The name of the ad.
 */
export function extractNameFromAdDescription(description, locale) {
    const match = description.match(locale.nameRegex);
    if (match && match.length === 2) {
        return match[1];
    }
    return description;
}
