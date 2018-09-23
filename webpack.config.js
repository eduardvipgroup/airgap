const path = require('path');
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'inline-source-map' : 'none',
  output: {
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    alias: {
      common: path.resolve(__dirname, 'frontend/scripts/common/'),
      classes: path.resolve(__dirname, 'frontend/scripts/classes/'),
      features: path.resolve(__dirname, 'frontend/scripts/features/'),
    },
  },
};
