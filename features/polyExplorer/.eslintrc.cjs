module.exports = {
    env: {
        browser: true,
        es6: true,
        // Only needed for tests/
        mocha: true,
        // Only needed for scripts/
        node: true,
    },
    globals: {
        expect: true,
        cy: true,
        Cypress: true,
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        "react/prop-types": 0,
    },
    overrides: [
        {
            files: ["*.js", "*.jsx"],
            parserOptions: {
                sourceType: "module",
                ecmaVersion: 2020,
            },
        },
        {
            // For some reason, plugin:react/recommended doesn't set this
            files: ["*.jsx"],
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    ],
};
