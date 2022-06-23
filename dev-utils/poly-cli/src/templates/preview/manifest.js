export function manifestTemplate(feature_name, author) {
    let t = {
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
                links: {},
            },
        },
    };

    return JSON.stringify(t, null, 2);
}
