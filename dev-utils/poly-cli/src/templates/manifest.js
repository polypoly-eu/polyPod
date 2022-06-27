export function manifestTemplate(feature_name, author, feature_type) {
    let base = {
        name: feature_name,
        author: author,
        description: "",
        thumbnail: "",
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
