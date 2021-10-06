const AD_LOCALE = {
    de: {
        category: "Werbeanzeigen",
        nameRegex: /^Werbeanzeige von (.+)$/,
    },
    en: {
        category: "Ads",
        nameRegex: /^Ad by (.+)$/,
    },
};

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
