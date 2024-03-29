module.exports = {
    extends: ["eslint:recommended"],
    env: {
        browser: true,
        es6: true,
        // Only needed for tests/
        mocha: true,
        // Only needed for scripts/
        node: true,
    },
    ignorePatterns: ["/public/*"],
    plugins: ["svelte3"],
    overrides: [
        {
            files: ["**/*.svelte"],
            processor: "svelte3/svelte3",
        },
    ],
    parserOptions: {
        sourceType: "module",
    },
};
