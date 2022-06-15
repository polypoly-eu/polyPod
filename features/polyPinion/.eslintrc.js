module.exports = {
    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-function": "off",
    },
    ignorePatterns: ["**/src/i18n/*.js", "**/src/questionnaire/*"],
    env: {
        browser: true,
    },
};
