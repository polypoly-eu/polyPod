module.exports = {
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: "module",
    },
    env: {
        "es6": true
    },
    rules: {
        semi: 2,
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
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/ban-ts-comment": "off",
                "@typescript-eslint/explicit-function-return-type": [
                    "error",
                    {
                        allowExpressions: true,
                    },
                ],
                "@typescript-eslint/no-this-alias": "off",
                "no-unused-vars": "off",
                "@typescript-eslint/no-unused-vars": ["warn"],
            },
        },
    ],
};
