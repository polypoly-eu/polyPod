const webpackPreprocessor = require('@cypress/webpack-preprocessor')

const webpackOptions = {
  resolve: {
    extensions: [".js"]
  },
  module: {
    rules: [
      {
        exclude: [/docs/],
      }
    ]
  }
};

const options = {
  webpackOptions
};

module.exports = webpackPreprocessor(options);