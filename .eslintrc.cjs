module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:prettier/recommended",
        "plugin:react/recommended"
    ],
    "plugins": [
        "cypress"
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    env: {
        browser : true,
        es6: true,
        mocha: true,
        jest: true,
        node: true,
        "cypress/globals": true
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    "ignorePatterns": [
        "*.conf.*",
        "*.config.*",
        "**/dist/*",
        "**/docs/*",
        "**/locales/*",
        "**/coverage/*",
        "data/",
        ".eslintrc.*",
        "**/public/build/*",
        "**/bubblewrap/build/*",
        "podApi/",
        "PolyPodApp/"],
    rules: {
        semi: 2,
        "react/prop-types": "off",
        "react/jsx-key": "off",
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            extends: [
                "plugin:@typescript-eslint/eslint-recommended",
                "plugin:@typescript-eslint/recommended",
            ],
            parser: "@typescript-eslint/parser",
            plugins: ["@typescript-eslint"],
            rules: {
                "@typescript-eslint/camelcase": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/ban-ts-comment": "off",
                "@typescript-eslint/explicit-function-return-type": [
                    "error",
                    {
                        allowExpressions: true,
                    },
                ],
                "@typescript-eslint/no-this-alias": "off",
            },
        },
        {
            files: ["*.jsx"],
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
        },
    ],
};
