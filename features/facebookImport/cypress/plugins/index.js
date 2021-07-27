const webpackPreprocessor = require("@cypress/webpack-preprocessor");

module.exports = (on) => {
    on("file:preprocessor", webpackPreprocessor());
};
