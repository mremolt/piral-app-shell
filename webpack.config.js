module.exports = function (config) {
  const tsRuleIndex = config.module.rules.findIndex((m) => m.test.toString() === /\.tsx?$/i.toString());
  const jsRuleIndex = config.module.rules.findIndex((m) => m.test.toString() === /\.m?jsx?$/i.toString());

  config.module.rules.splice(tsRuleIndex, 1, {
    test: /\.tsx?$/,
    loader: 'esbuild-loader',
    options: {
      loader: 'tsx',
      target: 'es2021',
    },
  });

  config.module.rules.splice(jsRuleIndex, 1, {
    test: /\.m?jsx?$/i,
    loader: 'esbuild-loader',
    options: {
      loader: 'jsx',
      target: 'es2021',
    },
  });

  return config;
};
