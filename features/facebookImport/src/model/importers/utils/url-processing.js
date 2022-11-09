/**
 * It takes a Facebook URL and returns an object with the account data (the URL and the URL ID).
 * @param urlString - The URL of the Facebook post. e.g.:
 * "https://www.facebook.com/<id>/posts/<somethig-else>"
 * "https://www.facebook.com/<id>/photos/<somethig-else>".
 * "https://www.facebook.com/<id>/videos/<somethig-else>".
 * @returns {{url: string, urlId: string}} - The account data, as an object with two properties: url and urlId.
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
 * It takes a Facebook permalink URL and returns the URL and raw ID of the account that posted the
 * content
 * @param urlString - The URL of the Facebook post, form of "https://www.facebook.com/permalink.php?id=<id> <other parameters>"
 * @returns {{url: string, rawId: string}} - An object with two properties: url and rawId.
 * {
 *     url: "https://www.facebook.com/<id>";
 *     rawId: "<id>"
 * }
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

/**
 * Try each strategy until one of them returns a non-null value.
 * @param urlString - The URL to extract the account data from.
 * @returns A function that takes a urlString as an argument and returns the extractedData.
 */
export function extractAccountDataFromUrl(urlString) {
    for (const strategy of STRATEGIES) {
        const extractedData = strategy(urlString);
        if (extractedData) {
            return extractedData;
        }
    }
    return null;
}
