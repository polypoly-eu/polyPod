module.exports = {
    extends: [
        "@polypoly-eu/eslint-config",
        "plugin:react/recommended"
    ],
    env: {
        browser: true
    },
    settings: {
        react: {
            version: "detect"
        }
    },
    rules: {
        "react/prop-types": 0
    },
    overrides: [
        {
            // For some reason, plugin:react/recommended doesn't set these options
            files: ["*.jsx"],
            parserOptions: {
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            }
        }
    ]
};
