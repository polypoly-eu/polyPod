module.exports = {
    extends: [
        "@polypoly-eu/eslint-config-polypoly"
    ],
    plugins: [
        "react"
    ],
    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-function": "off"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};
