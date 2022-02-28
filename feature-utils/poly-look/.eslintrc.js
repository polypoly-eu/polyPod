module.exports = {
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2020,
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
