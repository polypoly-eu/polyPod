export function manifestTemplate(feature_name, author, feature_type) {
    let t;
    if (feature_type === "preview") {
        t = {
            name: feature_name,
            author: author,
            description: "",
            thumbnail: "",
            primaryColor: "#ffffff",
            links: {
                "learn-more": "https://polypoly.org",
            },
            translations: {
                de: {
                    author: "",
                    description: "",
                },
            },
        };
    } else {
        t = {
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
    }

    return JSON.stringify(t, null, 2);
}
