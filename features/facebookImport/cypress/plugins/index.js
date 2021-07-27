const webpackPreprocessor = require("@cypress/webpack-preprocessor");

module.exports = (on, config) => {
    on("file:preprocessor", webpackPreprocessor());
};
