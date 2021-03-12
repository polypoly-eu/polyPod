module.exports = {
    extends: [
        "@polypoly-eu/eslint-config",
    ],
    env: {
        browser: true,
        es6: true,
    },
    overrides: [
        {
            files: ["*.js"],
            parserOptions: {
                sourceType: "module",
                ecmaVersion: 2020
            }
        }
    ]
};
