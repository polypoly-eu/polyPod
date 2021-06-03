const webpackPreprocessor = require('@cypress/webpack-preprocessor')

module.exports = (on) => {
  const options = {
    webpackOptions: require('../../webpack.config.cjs'),
  }

  on('file:preprocessor', webpackPreprocessor(options))
}