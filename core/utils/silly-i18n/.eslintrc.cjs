module.exports = {
    extends: [
        "@polypoly-eu/eslint-config",
    ],
    env: {
        browser: true,
        es6: true,
        jest: true,
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
