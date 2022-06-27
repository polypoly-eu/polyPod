export function manifestTemplate(feature_name, author, version, feature_type) {
    let base = {
        name: feature_name,
        author: author,
        version: version,
        description: "",
        thumbnail: "",
        thumbnailColor: "#ffffff",
        primaryColor: "#ffffff",
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
    }

    return JSON.stringify(base, null, 2);
}
