import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default (env) => {
  const mode = env.mode || 'development';
  const PORT = env.port || 3000;

  const isDev = mode === 'development';

  const config = {
    mode: mode,
    entry: resolve('./src/index.js'),
    output: {
      filename: '[name].[contenthash].js',
      path: resolve('./build'),
      clean: true,
      publicPath: './',
      pathinfo: false
    },

    devtool: isDev ? 'inline-source-map' : undefined,

    devServer: isDev
      ? {
          static: './build',
          open: true,
          hot: true,
          port: PORT,
          proxy: [
            {
              context: '/*',
              target: 'http://localhost:4000'
            }
          ]
        }
      : undefined,

    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        title: 'MENU DELIVERY CAR'
      })
    ],

    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico|pdf)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: 'asset/inline'
        },
        {
          test: /\.(csv|tsv)$/i,
          use: ['csv-loader']
        },
        {
          test: /\.xml$/i,
          use: ['xml-loader']
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      preferAbsolute: true,
      modules: ['node_modules'],
      mainFiles: ['index'],
      alias: {}
    }
  };

  return config;
};
