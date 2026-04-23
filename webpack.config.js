const webpack = require('webpack');

module.exports = {
  entry: './lib/index.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  mode: 'development',
  resolve: {
    modules: ['node_modules'],
    extensions: [ '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader', 
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      { test: /\.css$/, 
        use: ['style-loader', 'css-loader'] 
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader'],
      },
      { test: /\.(png|jpg|)$/, 
        loader: 'url-loader',
        options: {
          limit: 200000,
        },
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /node_modules\/(pdfkit|fontkit|png-js|linebreak|unicode-properties|brotli)\//,
        loader: 'transform-loader',
      },
      { test: /node_modules\/unicode-properties.*\.json$/, use: 'json-loader' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  devtool: 'source-map',
};
