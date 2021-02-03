module.exports = {
    extends: [
        "@polypoly-eu/eslint-config-polypoly",
        "plugin:react/recommended"
    ],
    parser: "espree",
    parserOptions: {
        ecmaVersion: 2015
    },
    env: {
        browser: true
    }
};
