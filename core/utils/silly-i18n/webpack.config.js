
module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        exclude: [
          './docs/',
          'coverage/',
          'test/'
        ]
      }
    ]
  },
};