module.exports = {
  extends: ["@polypoly-eu/eslint-config-polypoly"],
  globals: {
      "process": true,
      "console": true,
      "setTimeout": true
  },
  overrides: [
    {
        // For some reason, plugin:react/recommended doesn't set these options
        files: ["*.js"],
        parserOptions: {
            sourceType: "module",
        }
    }
    ]
};
