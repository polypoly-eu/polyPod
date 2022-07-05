import { convertCamelCaseToHyphen, isCamelCase } from "../utils.js";

export function manifestTemplate(feature_name, author, version, feature_type) {
    if (isCamelCase(feature_name)) {
        feature_name = convertCamelCaseToHyphen(feature_name);
    }

    let base = {
        name: feature_name,
        author: author,
        version: version,
        description: "",
        thumbnail: "",
        thumbnailColor: "#ffffff",
        primaryColor: "#ffffff",
        borderColor: "#ffffff",
        links: {},
        translations: {
            de: {
                name: `${feature_name} auf Deutsch`,
                author: "",
                description: "",
            },
        },
    };

    if (feature_type === "preview") {
        base.links = {
            "learn-more": "https://polypoly.org",
        };

        base.primaryColor = "#0f1938";
        base.borderColor = "#cbd5e0";
        base.tileTextColor = "#0f1938";
    }

    return JSON.stringify(base, null, 2);
}
