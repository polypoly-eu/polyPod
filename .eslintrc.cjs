module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:prettier/recommended",
        "plugin:react/recommended",
    ],
    plugins: ["cypress"],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
    },
    env: {
        browser: true,
        es6: true,
        mocha: true,
        jest: true,
        node: true,
        "cypress/globals": true,
    },
    settings: {
        react: {
            version: "latest",
        },
    },
    ignorePatterns: [
        "*.conf.*",
        "*.config.*",
        "*.bundled.*",
        "**/dist/*",
        "**/docs/*",
        "**/locales/*",
        "**/coverage/*",
        "**/node_modules/*",
        "data/",
        ".eslintrc.*",
        "**/build/*",
        "PolyPodApp/",
        "flatbuffers_shared/",
    ],
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
                "@typescript-eslint/no-explicit-any": "error",
                "@typescript-eslint/no-non-null-assertion": "error",
                "@typescript-eslint/ban-ts-comment": [
                    "error",
                    {
                        "ts-ignore": "allow-with-description",
                    },
                ],
                "@typescript-eslint/explicit-function-return-type": [
                    "error",
                    {
                        allowExpressions: true,
                    },
                ],
            },
        },
        {
            files: ["*.jsx"],
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    ],
};
