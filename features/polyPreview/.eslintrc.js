module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    overrides: [
        {
            files: ["*.js"],
            parserOptions: {
                sourceType: "module",
            }
        }
    ]
};
