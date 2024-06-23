const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const SentryUploadPlugin = require('./plugins/sentryUploadPlugin')

module.exports = {
  entry: './src/index',
  output: {
    // 如果你的配置中没有使用多入口（即只有一个入口），那么 '[name]' 将被替换为 'main'。
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            /** npm install @6babel-core babel-loader @babel/preset-env */
            loader: 'babel-loader',
            options: {
              // presets: ['@babel/preset-env']
              presets: ['@babel/preset-typescript']
            }
          }
        ]
      },
      // {
      //   /** npm install typescript ts-loader @babel/preset-typescript */
      //   test: /\.tsx?$/,
      //   use: [
      //     {
      //       loader: 'ts-loader',
      //     }
      //   ]
      // }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new ESLintPlugin({ extensions: ['.js', '.ts'] }), 
    new SentryUploadPlugin({
      domain: 'https://sentry.guanmai.cn',
      token: '8c47388015df4aa0b35257ba16fcd4a952379795f0f142fdb65c7530743e0e45',
      organization: 'guanmai',
      project: 'demo-test',
      release: '7.1.2',
    }),
  ]
}