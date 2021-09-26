const { AngularWebpackPlugin } = require('@ngtools/webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { resolve } = require('path');

module.exports = (config) => {
  // config.resolve.mainFields = ['fesm2015', 'esm2015', 'module', 'main'];
  // config.module.rules
  //   .filter((m) => m.test.toString() === /\.css$/i.toString())
  //   .forEach((m) => {
  //     m.exclude = /\.component.css$/i;
  //   });

  // config.module.rules
  //   .filter((m) => m.test.toString() === /\.s[ac]ss$/i.toString())
  //   .forEach((m) => {
  //     m.exclude = /\.component.s[ac]ss$/i;
  //   });

  // const ruleIndex = config.module.rules.findIndex((m) => m.test.toString() === /\.tsx?$/i.toString());

  // config.module.rules.splice(
  //   ruleIndex,
  //   1,
  //   {
  //     test: /\.[jt]sx?$/,
  //     loader: '@ngtools/webpack',
  //     include: resolve(__dirname, 'src'),
  //   },
  //   {
  //     test: /\.component.css$/i,
  //     use: ['to-string-loader', 'css-loader?esModule=false'],
  //     include: resolve(__dirname, 'src'),
  //   },
  //   {
  //     test: /\.component.s[ac]ss$/i,
  //     use: ['to-string-loader', 'css-loader?esModule=false', 'sass-loader'],
  //     include: resolve(__dirname, 'src'),
  //   }
  // );

  // config.plugins.push(
  //   new AngularWebpackPlugin({
  //     tsconfig: 'tsconfig.json',
  //     jitMode: true,
  //   }),
  //   new CopyPlugin({
  //     patterns: [{ from: resolve(__dirname, 'src/assets') }],
  //   })
  // );

  return config;
};
