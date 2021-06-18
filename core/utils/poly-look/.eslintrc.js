module.exports = {
  extends: ["eslint:recommended"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  globals: {
    window: true,
    console: true,
    describe: true,
    it: true,
    module: true,
    CustomEvent: true,
    beforeEach: true,
    afterEach: true,
    document: true,
    fetch: true,
    Promise: true,
  },
  rules: {
    semi: 2,
  },
  overrides: [],
};
