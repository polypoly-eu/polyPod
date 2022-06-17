export function template(feature_name, author) {
    let t = {
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
                links: {},
            },
        },
    };

    return JSON.stringify(t, null, 2);
}
