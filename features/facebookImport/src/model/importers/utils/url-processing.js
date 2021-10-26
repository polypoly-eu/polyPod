/**
 * Extract data from an url of the form:
 * "https://www.facebook.com/<id>/posts/<somethig-else>"
 * "https://www.facebook.com/<id>/photos/<somethig-else>".
 * "https://www.facebook.com/<id>/videos/<somethig-else>".
 *
 * Return this account data:
 *  {
 *     url: "https://www.facebook.com/<id>";
 *     urlId: "<id>"
 *  }
 */
export function extractAccountDataFromStandardUrl(urlString) {
    const postUrlMatch = urlString.match(
        /^(https:\/\/www\.facebook\.com\/([^/]+))\/(?:posts|photos|videos)\/.*$/
    );
    if (postUrlMatch && postUrlMatch.length === 3) {
        return { url: postUrlMatch[1], urlId: postUrlMatch[2] };
    }
    return null;
}

/**
 * Extract data from an url of the form:
 * "https://www.facebook.com/permalink.php?id=<id> <other parameters>"
 *
 * Return this account data:
 *  {
 *     url: "https://www.facebook.com/<id>";
 *     rawId: "<id>"
 *  }
 *
 */
export function extractAccountDataFromPermlinkUrl(urlString) {
    if (!urlString.startsWith("https://www.facebook.com/permalink.php?")) {
        return null;
    }
    const url = new URL(urlString);
    const id = url.searchParams.get("id");
    if (!id) {
        return null;
    }
    return { url: "https://www.facebook.com/" + id, rawId: id };
}

const STRATEGIES = [
    extractAccountDataFromStandardUrl,
    extractAccountDataFromPermlinkUrl,
];

export function extractAccountDataFromUrl(urlString) {
    for (const strategy of STRATEGIES) {
        const extractedData = strategy(urlString);
        if (extractedData) {
            return extractedData;
        }
    }
    return null;
}
