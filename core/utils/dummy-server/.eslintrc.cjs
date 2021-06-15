module.exports = {
    extends: ["@polypoly-eu/eslint-config"],
    globals: {
        process: true,
        console: true,
        setTimeout: true,
    },
    env: {
        node: true,
        es6: true,
    },
    overrides: [
        {
            files: ["*.js"],
            parserOptions: {
                sourceType: "module",
                ecmaVersion: 8,
            },
        },
    ],
};
