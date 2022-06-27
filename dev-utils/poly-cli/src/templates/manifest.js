export function manifestTemplate(feature_name, author, version, feature_type) {
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
                author: "",
                description: "",
            },
        },
    };

    if (feature_type === "preview") {
        base.links = {
            "learn-more": "https://polypoly.org",
        };

        base.thumbnailColor = "#ffffff";
        base.primaryColor = "#0f1938";
        base.borderColor = "#cbd5e0";
    }

    return JSON.stringify(base, null, 2);
}
