const rollupPreprocessor = require('@bahmutov/cy-rollup')

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('file:preprocessor', rollupPreprocessor());
}