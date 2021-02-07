module.exports = {
    extends: ["@polypoly-eu/eslint-config-polypoly"],
    globals: {
        process: true,
        console: true,
        setTimeout: true,
    },
    overrides: [
        {
            files: ["*.js"],
            parserOptions: {
                sourceType: "module",
            },
        },
    ],
};
