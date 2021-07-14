module.exports = function (api) {
  if (api) {
    api.cache(true);
  }

  const presets = [ "@babel/preset-env" ];
  const plugins = [
    "@babel/plugin-proposal-private-property-in-object",
    "@babel/plugin-proposal-private-methods"
  ];

  return {
    presets,
    plugins
  };
}