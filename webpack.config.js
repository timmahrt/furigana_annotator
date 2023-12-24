const path = require('path');

module.exports = {
  entry: './lib/index.js',
  experiments: {
    outputModule: true
  },
  output: {
    filename: 'furigana_annotator.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    }
  },
  // Add the following to resolve potential issues with export syntax
  externals: {
    // This tells webpack not to bundle the 'toggleFurigana' function
    './toggleFurigana': 'toggleFurigana',
  },
};
