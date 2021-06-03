const { IgnorePlugin } = require('webpack');

module.exports = {
  mode: 'development',
  plugins: [
    new IgnorePlugin( {
      resourceRegExp: /docs/
    })
  ],
};